# Crew Cutlery Case

A slim travel box with a snap-on lid for a personal fork / knife / spoon set (or chopsticks).

- Outside size: 205 × 52 × 29 mm. Inside: about 199 × 46 × 26 mm, which fits cutlery up to about 195 mm long.
- Two parts. The lid snaps over a lip on the base with a ridge on each long side, and a thumb notch on the front helps you pop it open.

## Files
- `cutlery_case_plate.stl`: both parts laid out side by side, ready to print together
- `cutlery_case_base.stl`, `cutlery_case_lid.stl`: each part on its own
- `cutlery_case.scad`: parametric source. Change `length` to fit your cutlery, `clearance` for the fit, `snap_bump` for how firmly it clicks, and set `lanes = 2` for divider rails.

## Print settings
- PETG, 0.2 mm layers, 3 walls, 15 % infill, no supports
- Print as laid out: the base open side up, the lid top face down
- Needs a bed that takes 205 mm (Ender 3, Prusa MK3/MK4, Bambu A1/P1/X1 all work; the Prusa Mini and Bambu A1 mini are too small, so set `length` to 175 for those)
- About 70 cm³ of solid model, roughly 45–55 g of filament

## Fit tuning
- Lid too tight: set `clearance = 0.3` and/or `snap_bump = 0.3`
- Lid too loose: set `snap_bump = 0.6`
