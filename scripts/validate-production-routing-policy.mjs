import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CALIBRATION_DIR = "D:\\ai-skill-eval-real-project\\routing-calibration-v2";
const CONFIG_PATH = path.join(CALIBRATION_DIR, "config.json");
const IMPLEMENTATION_PATH = path.join(CALIBRATION_DIR, "compare-policies.mjs");
const PRODUCTION_CONFIG_PATH = path.join(
  ROOT,
  "skills",
  "using-laravel-standards",
  "references",
  "family-gated-sparse-routing.json"
);
const FAMILY_INDEX_PATH = path.join(ROOT, "benchmark", "v4-family-index.json");
const SKILLS_DIR = path.join(ROOT, "skills");

const EXPECTED_CONFIG_SHA256 = "a94cfdf9a3290f0a6a63c4a578d96e2d7e4dfe89b7c9f019831354bb62ae978b";
const EXPECTED_IMPLEMENTATION_SHA256 = "d419a8ea19009b37f223a3564b5b61007f2ff4df279e12c35c6e7ea07c5a1686";
const SUPPORT_TRUE_MARKERS = [
  "primary and support",
  "route primary and support",
  "must also",
  "before",
  "after commit",
  "while",
  "and must",
  "plus",
  "rate limited",
  "authorization",
  "authorize",
  "private",
  "queued",
  "queue",
  "transaction",
  "xss"
];

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function sha256Text(text) {
  return createHash("sha256").update(text).digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function words(text) {
  return String(text || "").toLowerCase();
}

function countHits(text, terms) {
  const haystack = words(text);
  let score = 0;
  for (const term of terms || []) {
    const needle = words(term);
    if (needle && haystack.includes(needle)) score += needle.includes(" ") ? 2 : 1;
  }
  return score;
}

function textOf(caseItem) {
  return `${caseItem.prompt}`.toLowerCase();
}

function familyScores(caseItem, config) {
  const profiles = config.candidate_routing?.family_profiles || {};
  const text = textOf(caseItem);
  return Object.fromEntries(Object.entries(profiles).map(([family, terms]) => [family, countHits(text, terms)]));
}

function sortedScores(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function inferTaskFamily(caseItem, config) {
  const scores = familyScores(caseItem, config);
  const sorted = sortedScores(scores);
  const top = sorted[0] || [null, 0];
  const second = sorted[1] || [null, 0];
  return {
    family: top[1] > 0 ? top[0] : null,
    top_score: top[1],
    second_score: second[1],
    margin: top[1] - second[1],
    source: "profile_terms",
    scores
  };
}

function isGenericTask(caseItem, config) {
  const explicitGeneric = countHits(textOf(caseItem), config.candidate_routing?.generic_phrases || []) > 0;
  const topScore = inferTaskFamily(caseItem, config).top_score;
  return explicitGeneric && topScore <= 2;
}

function skillsForFamily(family, familyIndex) {
  return familyIndex.find((item) => item.family === family)?.specialists || [];
}

function familyForSkill(skill, familyIndex) {
  if (!skill) return null;
  return familyIndex.find((item) => item.specialists.includes(skill))?.family || null;
}

function canonicalFamily(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function skillScore(skill, caseItem, config, normalized) {
  const text = textOf(caseItem);
  const skillTerms = config.candidate_routing?.skill_profiles?.[skill] || [];
  let score = countHits(text, skillTerms);
  if (skill === normalized.proposed_primary_specialist) score += 2;
  if (skill === normalized.proposed_supporting_specialist) score += 1;
  score += Math.min(2, countHits(text, skill.split(/[-_]/g)));
  return score;
}

function rankSkillInFamily(family, caseItem, config, normalized, familyIndex, catalogSet) {
  const excluded = new Set(config.candidate_routing?.excluded_primary_skills || []);
  const candidates = skillsForFamily(family, familyIndex)
    .filter((skill) => catalogSet.has(skill))
    .filter((skill) => !excluded.has(skill));
  if (!candidates.length) return { skill: null, score: 0, second_score: 0, margin: 0, candidates: [] };
  const ranked = candidates
    .map((skill) => ({ skill, score: skillScore(skill, caseItem, config, normalized) }))
    .sort((a, b) => b.score - a.score || a.skill.localeCompare(b.skill));
  const top = ranked[0];
  const second = ranked[1] || { score: 0 };
  return {
    skill: top.skill,
    score: top.score,
    second_score: second.score,
    margin: top.score - second.score,
    candidates: ranked
  };
}

function supportRequiredSignal(caseItem, normalized, familyInference, policy) {
  const markerScore = countHits(textOf(caseItem), SUPPORT_TRUE_MARKERS);
  const cross = Number(normalized.cross_cutting_signal?.strength || 0);
  const smv = Number(normalized.knowledge_need_components?.specialist_marginal_value || 0);
  const generic = Number(normalized.knowledge_need_components?.generic_sufficiency || 0);
  const profileSecondClose = familyInference.second_score > 0 && familyInference.margin <= 2;
  const rawSupport = Boolean(normalized.proposed_supporting_specialist);
  const score =
    markerScore +
    (cross >= policy.support_threshold ? 2 : 0) +
    (smv >= 0.3 ? 1 : 0) +
    (rawSupport ? 1 : 0) +
    (profileSecondClose ? 1 : 0) -
    (generic >= 0.8 ? 1 : 0);
  return {
    required: score >= (policy.support_signal_threshold ?? 4),
    score,
    marker_score: markerScore,
    cross,
    smv,
    generic,
    raw_support: rawSupport,
    profile_second_close: profileSecondClose
  };
}

function compatibleSupportFamilies(primaryFamily, taskFamily, config) {
  const matrix = config.candidate_routing?.support_compatibility || {};
  return new Set([...(matrix[primaryFamily] || []), ...(matrix[taskFamily] || [])]);
}

function supportFamilyScores(caseItem, config, primaryFamily, taskFamily, normalized, familyIndex) {
  const scores = familyScores(caseItem, config);
  const compatible = compatibleSupportFamilies(primaryFamily, taskFamily, config);
  const primaryResponsibility = new Set([primaryFamily, taskFamily].filter(Boolean));
  const proposedSupportFamily = familyForSkill(normalized.proposed_supporting_specialist, familyIndex);
  const proposedCrossFamily = familyForSkill(normalized.cross_cutting_signal?.domain, familyIndex) ||
    canonicalFamily(normalized.cross_cutting_signal?.domain);
  const ranked = [];
  for (const family of compatible) {
    if (!family || primaryResponsibility.has(family)) continue;
    let score = scores[family] || 0;
    if (family === proposedSupportFamily) score += 3;
    if (family === proposedCrossFamily) score += 2;
    ranked.push({ family, score });
  }
  return ranked.sort((a, b) => b.score - a.score || a.family.localeCompare(b.family));
}

function activation({ mode, primary, support, effectiveNeed, effectiveConfidence, reason, base = {}, diagnostics = {} }) {
  const selected = [mode > 0 ? primary : null, mode === 2 ? support : null].filter(Boolean).slice(0, 2);
  return {
    mode,
    primary_loaded: mode > 0 ? primary : null,
    support_loaded: mode === 2 ? support : null,
    selected_specialists: selected,
    specialist_count: selected.length,
    effective_need: effectiveNeed ?? base.effective_need,
    effective_confidence: effectiveConfidence ?? base.effective_confidence,
    activation_reason: reason,
    diagnostics: { ...(base.diagnostics || {}), ...diagnostics }
  };
}

function applyProductionPolicy({ caseItem, normalized, policy, config, familyIndex, catalog }) {
  if (!normalized || typeof normalized !== "object") {
    return activation({ mode: 0, primary: null, support: null, reason: "invalid routing signal" });
  }
  const catalogSet = new Set(catalog.map((item) => item.name));
  const familyInference = inferTaskFamily(caseItem, config);
  const excludedFamilies = new Set(config.candidate_routing?.excluded_primary_families || []);
  const riskModifier = policy.risk_modifiers?.[normalized.risk_level] ?? 0;
  const effectiveNeed = Math.min(1, Number(normalized.raw_knowledge_need || normalized.knowledge_need || 0) + riskModifier);
  const generic = isGenericTask(caseItem, config);
  if (generic || effectiveNeed < policy.need_threshold || !familyInference.family || excludedFamilies.has(familyInference.family)) {
    return activation({
      mode: 0,
      primary: null,
      support: null,
      effectiveNeed,
      reason: generic ? "generic task suppressed" : "family gated no primary",
      diagnostics: { family_inference: familyInference }
    });
  }
  const primaryRank = rankSkillInFamily(familyInference.family, caseItem, config, normalized, familyIndex, catalogSet);
  if (!primaryRank.skill || Number(normalized.confidence || 0) < policy.confidence_threshold) {
    return activation({
      mode: 0,
      primary: null,
      support: null,
      effectiveNeed,
      reason: "confidence or rank failed",
      diagnostics: { family_inference: familyInference, primary_rank: primaryRank }
    });
  }

  const base = activation({
    mode: 1,
    primary: primaryRank.skill,
    support: null,
    effectiveNeed,
    reason: "family gated primary",
    diagnostics: { family_inference: familyInference, primary_rank: primaryRank }
  });
  const taskFamily = familyInference.family;
  const primaryFamily = familyForSkill(base.primary_loaded, familyIndex);
  const supportSignal = supportRequiredSignal(caseItem, normalized, familyInference, policy);
  if (!supportSignal.required) {
    return activation({
      ...base,
      mode: 1,
      primary: base.primary_loaded,
      support: null,
      reason: "support compatibility not required",
      base,
      diagnostics: { support_signal: supportSignal }
    });
  }
  const supportFamilies = supportFamilyScores(caseItem, config, primaryFamily, taskFamily, normalized, familyIndex);
  const supportFamily = supportFamilies.find((item) => item.score > 0)?.family || null;
  if (!supportFamily) {
    return activation({
      ...base,
      mode: 1,
      primary: base.primary_loaded,
      support: null,
      reason: "no compatible support family",
      base,
      diagnostics: { support_signal: supportSignal, support_families: supportFamilies }
    });
  }
  const supportRank = rankSkillInFamily(supportFamily, caseItem, config, normalized, familyIndex, catalogSet);
  if (!supportRank.skill || supportRank.skill === base.primary_loaded) {
    return activation({
      ...base,
      mode: 1,
      primary: base.primary_loaded,
      support: null,
      reason: "no compatible support skill",
      base,
      diagnostics: { support_signal: supportSignal, support_families: supportFamilies, support_rank: supportRank }
    });
  }
  return activation({
    ...base,
    mode: 2,
    primary: base.primary_loaded,
    support: supportRank.skill,
    reason: "compatible support",
    base,
    diagnostics: { support_signal: supportSignal, support_families: supportFamilies, support_rank: supportRank }
  });
}

function catalogFromSkills() {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ name: entry.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function normalized(overrides = {}) {
  return {
    primary_domain: null,
    knowledge_need: 0.75,
    confidence: 0.88,
    ambiguity: 0.12,
    cross_cutting_signal: { strength: 0.1, domain: null },
    risk_level: "MEDIUM",
    proposed_primary_specialist: null,
    proposed_supporting_specialist: null,
    reason: "static production routing regression",
    raw_knowledge_need: 0.7,
    knowledge_need_components: {
      specialist_marginal_value: 0.7,
      invariant_requirement: 0.7,
      domain_specificity: 0.8,
      cross_boundary_complexity: 0.2,
      generic_sufficiency: 0.1
    },
    ...overrides,
    knowledge_need_components: {
      specialist_marginal_value: 0.7,
      invariant_requirement: 0.7,
      domain_specificity: 0.8,
      cross_boundary_complexity: 0.2,
      generic_sufficiency: 0.1,
      ...(overrides.knowledge_need_components || {})
    }
  };
}

function sameActivation(a, b) {
  return a.mode === b.mode &&
    a.primary_loaded === b.primary_loaded &&
    a.support_loaded === b.support_loaded &&
    a.specialist_count === b.specialist_count;
}

function assertActivation(test, actual) {
  for (const [field, expected] of Object.entries(test.expected)) {
    assert(actual[field] === expected, `${test.id} expected ${field}=${expected}, got ${actual[field]}`);
  }
  assert(actual.specialist_count <= 2, `${test.id} exceeded specialist hard cap`);
  assert(!actual.selected_specialists.includes("memory-management"), `${test.id} selected memory-management as specialist`);
}

async function main() {
  assert(existsSync(CONFIG_PATH), `Missing calibration config: ${CONFIG_PATH}`);
  assert(existsSync(IMPLEMENTATION_PATH), `Missing calibration implementation: ${IMPLEMENTATION_PATH}`);
  assert(existsSync(PRODUCTION_CONFIG_PATH), `Missing production config: ${PRODUCTION_CONFIG_PATH}`);

  const calibrationConfig = readJson(CONFIG_PATH);
  const sourcePolicy = calibrationConfig.candidate_policies.find((policy) => policy.id === "candidate_b_family_gated_support_compat");
  assert(sourcePolicy, "Missing candidate_b source policy in calibration config");

  const configSha = sha256Text(stableStringify(sourcePolicy));
  const implSha = sha256Text(readFileSync(IMPLEMENTATION_PATH, "utf8"));
  assert(configSha === EXPECTED_CONFIG_SHA256, `Candidate B config hash drift: ${configSha}`);
  assert(implSha === EXPECTED_IMPLEMENTATION_SHA256, `Candidate B implementation hash drift: ${implSha}`);

  const production = readJson(PRODUCTION_CONFIG_PATH);
  assert(production.source_config_sha256 === EXPECTED_CONFIG_SHA256, "Production config records wrong source config hash");
  assert(production.source_implementation_sha256 === EXPECTED_IMPLEMENTATION_SHA256, "Production config records wrong implementation hash");
  assert(production.semantic_name === "family_gated_sparse_routing", "Production semantic name drift");
  assert(production.policy.strategy === sourcePolicy.strategy, "Policy strategy drift");
  for (const field of ["need_threshold", "confidence_threshold", "support_threshold", "support_signal_threshold"]) {
    assert(production.policy[field] === sourcePolicy[field], `Policy ${field} drift`);
  }
  assert(
    stableStringify(production.policy.risk_modifiers) === stableStringify(sourcePolicy.risk_modifiers),
    "Risk modifier drift"
  );
  assert(
    stableStringify(production.candidate_routing) === stableStringify(calibrationConfig.candidate_routing),
    "Candidate routing profile drift"
  );

  const familyIndex = readJson(FAMILY_INDEX_PATH);
  const catalog = catalogFromSkills();
  const { applyCandidatePolicy } = await import(pathToFileURL(IMPLEMENTATION_PATH).href);

  const tests = [
    {
      id: "A_PRIMARY_ONLY_VALIDATION",
      prompt: "Create a Form Request with validation rules that reject an invalid payload, require an email, and return clear validation errors.",
      normalized: normalized({ proposed_primary_specialist: "form-requests", risk_level: "LOW", raw_knowledge_need: 0.6 }),
      expected: { mode: 1, primary_loaded: "form-requests", support_loaded: null, specialist_count: 1 }
    },
    {
      id: "B_COMPATIBLE_SUPPORT",
      prompt: "Route primary and support: create a Form Request validation flow that must also authorize the current user before accepting a private account payload, plus return validation errors.",
      normalized: normalized({
        cross_cutting_signal: { strength: 0.9, domain: "policies-and-authorization" },
        proposed_primary_specialist: "form-requests",
        proposed_supporting_specialist: "policies-and-authorization",
        raw_knowledge_need: 0.75
      }),
      expected: { mode: 2, primary_loaded: "form-requests", support_loaded: "policies-and-authorization", specialist_count: 2 }
    },
    {
      id: "C_GENERIC_SUPPRESSION",
      prompt: "A plain string variable should be renamed. There is no database, no upload, no schema, no livewire, no blade, no assertion, and no background work; ordinary PHP is enough.",
      normalized: normalized({
        proposed_primary_specialist: "form-requests",
        raw_knowledge_need: 0.9,
        knowledge_need_components: { generic_sufficiency: 0.95 }
      }),
      expected: { mode: 0, primary_loaded: null, support_loaded: null, specialist_count: 0 }
    },
    {
      id: "D_WEAK_SUPPORT_SIGNAL",
      prompt: "Create a Form Request that validates a label field. The task mentions a second concern vaguely, but only asks for validation rules.",
      normalized: normalized({
        cross_cutting_signal: { strength: 0.7, domain: null },
        proposed_primary_specialist: "form-requests",
        raw_knowledge_need: 0.65,
        knowledge_need_components: { specialist_marginal_value: 0.2, cross_boundary_complexity: 0.1 }
      }),
      expected: { mode: 1, primary_loaded: "form-requests", support_loaded: null, specialist_count: 1 }
    },
    {
      id: "E_META_PRIMARY_SUPPRESSION",
      prompt: "Use memory-management to recall context and update planning notes for the next handoff.",
      normalized: normalized({
        proposed_primary_specialist: "memory-management",
        raw_knowledge_need: 0.9
      }),
      expected: { mode: 0, primary_loaded: null, support_loaded: null, specialist_count: 0 }
    },
    {
      id: "F_MEMORY_OUTSIDE_SPECIALIST_COUNT",
      prompt: "Before editing, recall project memory; then implement a Form Request validation rule for an incoming payload and validation errors.",
      normalized: normalized({
        proposed_primary_specialist: "form-requests",
        proposed_supporting_specialist: "memory-management",
        raw_knowledge_need: 0.7
      }),
      expected: { mode: 1, primary_loaded: "form-requests", support_loaded: null, specialist_count: 1 }
    },
    {
      id: "G_INVALID_ROUTER_SIGNAL_FALLBACK",
      prompt: "Invalid router output should never select a specialist.",
      normalized: null,
      expected: { mode: 0, primary_loaded: null, support_loaded: null, specialist_count: 0 },
      skipFrozenEquivalence: true
    },
    {
      id: "H_HARD_CAP_WITH_MANY_DOMAINS",
      prompt: "Route primary and support for a Form Request validation task that must also authorize the current user before queued queue processing, plus API JSON resource pagination, cache invalidation, transaction consistency, and private account checks.",
      normalized: normalized({
        cross_cutting_signal: { strength: 1, domain: "policies-and-authorization" },
        proposed_primary_specialist: "form-requests",
        proposed_supporting_specialist: "policies-and-authorization",
        risk_level: "HIGH",
        raw_knowledge_need: 0.85
      }),
      expected: { mode: 2, primary_loaded: "api-resources-and-pagination", support_loaded: "policies-and-authorization", specialist_count: 2 }
    }
  ];

  for (const test of tests) {
    const caseItem = { id: test.id, prompt: test.prompt, risk: test.normalized?.risk_level || "MEDIUM" };
    const productionActivation = applyProductionPolicy({
      caseItem,
      normalized: test.normalized,
      policy: production.policy,
      config: production,
      familyIndex,
      catalog
    });
    assertActivation(test, productionActivation);

    if (!test.skipFrozenEquivalence) {
      const frozenActivation = applyCandidatePolicy({
        caseItem,
        normalized: test.normalized,
        policy: sourcePolicy,
        config: calibrationConfig,
        familyIndex,
        catalog
      });
      assert(
        sameActivation(productionActivation, frozenActivation),
        `${test.id} production/frozen activation mismatch: production=${JSON.stringify(productionActivation)} frozen=${JSON.stringify(frozenActivation)}`
      );
    }
  }

  console.log("PRODUCTION_ROUTING_POLICY_VALID=YES");
  console.log(`CANDIDATE_B_CONFIG_SHA256=${configSha}`);
  console.log(`CANDIDATE_B_IMPLEMENTATION_SHA256=${implSha}`);
  console.log(`PRODUCTION_SEMANTIC_NAME=${production.semantic_name}`);
  console.log(`REGRESSION_TESTS=${tests.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
