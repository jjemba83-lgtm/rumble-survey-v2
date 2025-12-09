# Rumble Boxing Choice-Based Conjoint (CBC) Study Design

## Overview

This document describes the D-optimal experimental design for the Rumble Boxing 2026 Refresh pricing study. The design was generated using R's `AlgDesign` package to support a Choice-Based Conjoint analysis aimed at estimating customer willingness-to-pay for membership features.

## Study Objective

Estimate customer valuations and trade-offs to support a Complexity-Based Pricing (Attribute-Based Pricing) strategy, gating desirable non-fitness attributes behind higher membership tiers to maximize Average Revenue Per Member (ARPM).

---

## Design Specifications

### Attributes and Levels

| Attribute | Levels | Strategic Rationale |
|-----------|--------|---------------------|
| **Price** | $129, $189, $229, $269 | Core financial trade-off for tier determination |
| **Class Count** | 4, 8, 12, Unlimited | Core usage metric |
| **Booking Window** | 7, 10, 14, 30 Days | Monetizing convenience for time-sensitive members |
| **Guest Passes** | None, 1/Quarter, 1/Month, 2/Month | Monetizing community aspect |
| **Perks** | None, 5% Off, 10% Off + Rental, 15% Off + Elite | Creating value narrative for price elevation |

### Design Parameters

| Parameter | Value |
|-----------|-------|
| Total unique profiles | 100 |
| Alternatives per choice task | 2 (+ "None of these" option) |
| Unique choice tasks | 50 |
| Tasks per respondent | 8 (randomly assigned) |
| Target respondents | 200-300 |
| Target locations | Montclair, Livingston, Short Hills |

---

## Design Generation Method

### Algorithm
- **Package:** AlgDesign (R)
- **Function:** `optFederov()` with D-optimality criterion
- **Candidate set:** Full factorial (4^5 = 1,024 profiles)
- **Selection:** 100 D-optimal profiles from candidate set
- **Blocking:** Random pairing into 50 choice tasks

### Why Random Pairing Over optBlock?

Initial attempts using `optBlock()` for optimal blocking resulted in reduced design efficiency:

| Metric | optBlock | Random Pairing | Winner |
|--------|----------|----------------|--------|
| D (determinant) | 0.104 | **0.176** | Random |
| A (avg variance) | 11.33 | **8.59** | Random |
| Geff | N/A | **0.96** | Random |
| Deffbound | N/A | **0.959** | Random |
| Diagonality | **0.784** | 0.756 | optBlock |
| gmean.variances | 12.23 | **8.05** | Random |

Random pairing preserves the D-optimal properties of the selected profiles without imposing constraints that reduce overall efficiency.

---

## Design Quality Metrics

### Efficiency Measures

| Metric | Value | Interpretation |
|--------|-------|----------------|
| **Geff** | 0.96 (96%) | Excellent - near optimal prediction variance |
| **Deffbound** | 0.959 (95.9%) | Excellent - D-efficiency lower bound |
| **Diagonality** | 0.756 (75.6%) | Good - acceptable parameter correlation |
| **A (avg variance)** | 8.59 | Lower is better |
| **Determinant** | 0.176 | Scaled D-criterion |

### Level Balance

All attribute levels appear with near-equal frequency (24-27 appearances per level out of 100 profiles):

| Attribute | Level Distribution |
|-----------|-------------------|
| Price | P_129: 24, P_189: 26, P_229: 25, P_269: 25 |
| Count | C_4: 24, C_8: 27, C_12: 24, C_Unl: 25 |
| Booking | B_7D: 24, B_10D: 25, B_14D: 26, B_30D: 25 |
| Guest | G_None: 25, G_1Q: 25, G_1M: 25, G_2M: 25 |
| Perks | P_None: 24, P_5P: 25, P_10P: 26, P_15P: 25 |

### Confounding Assessment

**Between-attribute correlations:** 0.00 - 0.04 (Excellent)
- Price is essentially uncorrelated with all other attributes
- All attribute pairs show minimal confounding

**Within-attribute correlations:** ~0.50 (Expected)
- This is a mechanical result of dummy coding mutually exclusive levels
- Not a design flaw

---

## Sample Size Justification

### Johnson & Orme (2003) Formula

```
n ≥ (500 × c) / (t × a)

Where:
  n = respondents
  c = max levels per attribute (4)
  t = tasks per respondent (8)
  a = alternatives per task (2)

n ≥ (500 × 4) / (8 × 2) = 125 minimum
```

### Level Exposure Target

Rule of thumb: 1,000 appearances per attribute level

| Respondents | Total Profile Views | Views per Level |
|-------------|---------------------|-----------------|
| 200 | 3,200 | ~800 per level |
| 300 | 4,800 | ~1,200 per level ✓ |

**Recommendation:** Target 250-300 respondents to exceed the 1,000 threshold comfortably.

---

## Survey Implementation

### File Output

`rumble_cbc_questions_random.csv` contains:
- 100 rows (profiles)
- Columns: Price, Count, Booking, Guest, Perks, Question_ID
- Question_ID groups profiles into 50 choice tasks (2 profiles per task)

### Survey Logic

1. Each respondent is randomly assigned 8 of the 50 choice tasks
2. Each task displays:
   - Option A (first profile in Question_ID pair)
   - Option B (second profile in Question_ID pair)
   - Option C: "None of these"
3. Task order is randomized per respondent
4. Option order (A/B) may be randomized within tasks

### Human-Readable Labels

| Code | Display Label |
|------|---------------|
| P_129 | $129/month |
| P_189 | $189/month |
| P_229 | $229/month |
| P_269 | $269/month |
| C_4 | 4 Classes |
| C_8 | 8 Classes |
| C_12 | 12 Classes |
| C_Unl | Unlimited |
| B_7D | 7 Days |
| B_10D | 10 Days |
| B_14D | 14 Days |
| B_30D | 30 Days |
| G_None | None |
| G_1Q | 1 per Quarter |
| G_1M | 1 per Month |
| G_2M | 2 per Month |
| P_None | None |
| P_5P | 5% Off Retail |
| P_10P | 10% Off + Free Rental |
| P_15P | 15% Off + Elite Status |

---

## R Code Reference

```r
library(AlgDesign)

# Define attributes
ATT_PRICE <- factor(c("P_129", "P_189", "P_229", "P_269"))
ATT_COUNT <- factor(c("C_4", "C_8", "C_12", "C_Unl")) 
ATT_BOOKING <- factor(c("B_7D", "B_10D", "B_14D", "B_30D")) 
ATT_GUEST <- factor(c("G_None", "G_1Q", "G_1M", "G_2M")) 
ATT_PERKS <- factor(c("P_None", "P_5P", "P_10P", "P_15P"))

RUMBLE_ATTRIBUTES <- list(
  Price = ATT_PRICE, 
  Count = ATT_COUNT, 
  Booking = ATT_BOOKING, 
  Guest = ATT_GUEST, 
  Perks = ATT_PERKS 
)

# Generate candidate set
CANDIDATE_SET <- expand.grid(RUMBLE_ATTRIBUTES)

# D-optimal formula (with intercept for proper contrast coding)
RUMBLE_FORMULA <- ~ Price + Count + Booking + Guest + Perks

# Select 100 D-optimal profiles
D_OPTIMAL_ROWS <- optFederov( 
  frml = RUMBLE_FORMULA,
  data = CANDIDATE_SET,
  nTrials = 100,
  criterion = "D"
)

# Random pairing into 50 choice tasks
set.seed(123)
shuffled <- D_OPTIMAL_ROWS$design[sample(nrow(D_OPTIMAL_ROWS$design)), ]
shuffled$Question_ID <- rep(1:50, each = 2)
RANDOM_CBC_DESIGN <- shuffled

# Evaluate design
eval.design(
  frml = RUMBLE_FORMULA,
  design = RANDOM_CBC_DESIGN,
  X = CANDIDATE_SET,
  confounding = TRUE
)

# Export
write.csv(RANDOM_CBC_DESIGN, "rumble_cbc_questions_random.csv", row.names = FALSE)
```

---

## Analysis Plan (Post-Data Collection)

### Model Specification
- **Model:** Multinomial Logit (MNL)
- **R packages:** `mlogit`, `logitr`, or `apollo`
- **Python:** `statsmodels`, `pylogit`, or `xlogit`

### Key Outputs
1. **Part-worth utilities** for each attribute level
2. **Willingness-to-pay (WTP)** calculated as: WTP = -β_attribute / β_price
3. **Market simulation** for proposed tier configurations
4. **Predicted ARPM** under different pricing scenarios

---

## Version History

| Date | Version | Notes |
|------|---------|-------|
| December 2024 | 1.0 | Initial D-optimal design with random pairing |

---

## References

- Johnson, R. M., & Orme, B. K. (2003). Getting the most from CBC. Sawtooth Software Research Paper Series.
- Wheeler, R.E. (2004). AlgDesign. The R Project for Statistical Computing.
- Traets, F., Sanchez, G., & Vandebroek, M. (2020). Generating Optimal Designs for Discrete Choice Experiments in R: The idefix Package. Journal of Statistical Software, 96(3).
