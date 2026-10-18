# events.csv rows 76-148: verification summary

Rows are data rows (header excluded). Output: `events_checks_76_148.csv`. No source CSV was edited.

## Counts (73 rows)
- confirmed: 43
- confirmed_with_corrections: 13 (rows 79, 80, 83, 89, 102, 110, 113, 115, 121, 134, 138, 144, 145)
- not_confirmed: 17 (rows 76, 82, 86, 94, 99, 101, 103, 105, 106, 109, 111, 116, 124, 127, 128, 132, 143)
- contradicted: 0 (nothing was positively refuted; the not_confirmed rows have no support in the pages fetched)
- duplicate: 0 (rows 120/129 and 84/96 overlap but describe different scopes)

## Weakest items
Template-style rows with a name such as "1st Damascus Pogrom", "Edrine Massacres", "4th Damanahur Massacres", "Irbid Massacres", "Ikhwan Massacres" and no description. Their cited Wikipedia pages (fetched in full) do not mention them, and several have coordinates of a different city (Homs, Damanhur, Port Said and Djerba rows sit on Damascus, Cairo or Tunis; row 124 sits in Ukraine). Rows 76, 82, 86, 94, 101, 103, 105, 106, 109, 111, 116, 124, 127, 128 are probably generated entries and should be removed or re-researched.
Real but different events turned up for some: Edirne 1872 was a ritual-murder calumny, not a massacre (row 89); Damanhur had blood libels in 1871/1877/1882/1892 (rows 87, 106); Port Said had riots 1883 and a synagogue desecration or blood libel 1902 per Landau (rows 111, 116).
Vague rows with no discrete event: 99 (Budapest zone), 132 (Berlin 1933-45), 143 (Tel Aviv state events).

## Source URL problems
Row 113 (1905 Odessa pogrom) and 121 (Lviv pogroms 1918-1940) and 132 (Berlin) Wikipedia URLs return 404; replacements are in the CSV. Row 147's cited page does not state the 1943 lobbying (the Wikipedia Amin al-Husseini page does). Row 80's cited Turkish page does not state 1866. Row 96/84 JE page does not use the name "Mejba".

## Classification and geography notes
Row 79 should be type 5 (unpunished murders, not a pogrom). Row 144 is a revolt (type 8). Row 145 is a mellah foundation (type 7). Row 133 has no Jewish victims (relevance doubtful). Row 138 Kristallnacht was nationwide. Row 110 mixes Taza 1903 and Settat 1907 and should be split. Row 134 ellipse is too small for four towns.

## Method and what could not be checked
Pages were fetched in full and searched locally (Wikipedia, Jewish Encyclopedia, JVL, encyclopedia.com, JTA, Landau via benyehuda.org, he.wikipedia). Casualty figures quoted come from those pages. Not checked: the exact end date (19 April) of row 118; row 123 type judgement; centres and radii of well-documented rows were compared with page coordinates only roughly. The historical background to the unconfirmed rows was searched only via WebSearch plus the pages above, so "not_confirmed" means "not found", not "disproved". The Hebrew descriptions of the confirmed rows were read for faithfulness and found consistent with the English; Hebrew replacements are given only for corrected rows. The 1869 Tunis toll (17 vs 18) and the Casablanca 1907 toll (30 vs ">60") are source disagreements.
