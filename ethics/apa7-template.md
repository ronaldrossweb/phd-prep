# APA 7 Template and Cheat-Sheet

Doctoral coursework is graded partly on format. Losing marks on mechanics you could have templated is
avoidable, so template it now.

---

## Paper skeleton

```
                                                              [page number, top right]

                        Title of the Paper in Title Case
                     Not Bold in APA 7 Student Paper Format

                                  Ronald Ross

                        University of the Cumberlands

                    PhDAI 832: Ethics in Responsible AI

                            Dr. [Instructor Name]

                               [Due Date]


                            [page break]

                                  Abstract

150-250 words, one paragraph, no indent. State the problem, your approach, your
central claim, and the implication. Write it LAST.

Keywords: artificial intelligence, algorithmic fairness, model risk management


                            [page break]

                        Title of the Paper Repeated

Introduction text begins here, indented, double-spaced, 12pt Times New Roman
(or 11pt Calibri / Arial — APA 7 permits several). Do NOT use the heading
"Introduction"; the repeated title serves that role.

                              Level 1 Heading
                        [centered, bold, title case]

Body text.

Level 2 Heading
[flush left, bold, title case]

Body text.

     Level 3 Heading. [indented, bold, italic, period, text runs on same line]

                            [page break]

                                 References

Hanging indent, alphabetical by author surname, double-spaced.
```

## Reference formats you will actually need

**Journal article with DOI**
> Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an
> algorithm used to manage the health of populations. *Science, 366*(6464), 447–453.
> https://doi.org/10.1126/science.aax2342

**Book**
> O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens
> democracy*. Crown.

**Government / organisational report**
> National Institute of Standards and Technology. (2023). *Artificial intelligence risk management
> framework (AI RMF 1.0)* (NIST AI 100-1). U.S. Department of Commerce.
> https://doi.org/10.6028/NIST.AI.100-1

**Conference paper**
> Mitchell, M., Wu, S., Zaldivar, A., Barnes, P., Vasserman, L., Hutchinson, B., Spitzer, E., Raji,
> I. D., & Gebru, T. (2019). Model cards for model reporting. In *Proceedings of the Conference on
> Fairness, Accountability, and Transparency* (pp. 220–229). ACM.
> https://doi.org/10.1145/3287560.3287596

**Web page, organisational author**
> Board of Governors of the Federal Reserve System. (2011). *Supervisory guidance on model risk
> management* (SR 11-7). https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm

**Preprint**
> Kleinberg, J., Mullainathan, S., & Raghavan, M. (2016). *Inherent trade-offs in the fair
> determination of risk scores*. arXiv. https://arxiv.org/abs/1609.05807

## In-text citation

| Situation | Form |
|---|---|
| Paraphrase, parenthetical | (Obermeyer et al., 2019) |
| Paraphrase, narrative | Obermeyer et al. (2019) found that... |
| Two authors | (Barocas & Hardt, 2023) — always `&` inside parentheses, "and" in text |
| 3+ authors | (Mitchell et al., 2019) — `et al.` from the very first citation in APA 7 |
| Direct quote | (O'Neil, 2016, p. 84) — page number required |
| Organisation, first use | (National Institute of Standards and Technology [NIST], 2023) |
| Organisation, after | (NIST, 2023) |
| Secondary source | (as cited in Crawford, 2021) — use sparingly; find the original |

## Mistakes that cost marks

1. **`et al.` from the first citation** for 3+ authors. APA 6 required listing them all first time;
   APA 7 does not. Old habits and old templates get this wrong.
2. **Title is not bold** on the title page in student format. It *is* bold as a Level 1 heading.
3. **DOIs as full `https://doi.org/...` URLs.** No "Retrieved from", no trailing period after a URL.
4. **Running heads are not required** in APA 7 student papers. Page numbers are.
5. **Every reference must be cited in text, and every citation must appear in the references.** Graders
   check this, and mismatches are easy to spot.
6. **One space after a period** in APA 7.
7. **Quotes over 40 words** become block quotes: indented half an inch, no quotation marks, citation
   after the final period.

## A structure that works for an ethics case paper

Reusable for most PhDAI 832 assignments:

1. **Introduction** — the case, why it matters, and your thesis in one sentence.
2. **Background** — what happened, factually, cited. Keep it tight; the grader knows the case.
3. **Ethical analysis** — the principle(s) at stake, named from a framework. **Where the marks are.**
4. **Framework application** — walk it through NIST AI RMF's four functions, or the EU AI Act tiers.
5. **The technical constraint** — what was mathematically achievable. Cite the impossibility result
   where relevant. *This is the section most students cannot write, and you can.*
6. **Counterfactual design** — what should have been built, specifically. Not "more oversight" but
   *which* control, at *which* lifecycle stage, owned by *whom*.
7. **Conclusion** — restate the thesis, note limitations, name what remains unresolved.

## Setting this up before Oct 19

- Build the title page once as `PhDAI832_template.docx`. Reuse it every time.
- **Install Zotero** plus the browser connector and the Word plugin. One click captures a citation;
  the plugin formats the bibliography. Over a 60-credit doctorate this saves days.
- Save the seven reference formats above into a Zotero folder now, with the real entries. Those
  sources will carry most of your ethics coursework.
