# Crew Cutlery Case (v2: slim and rounded, with utensil clips)

A slim, pill-shaped travel case with a snap-on lid and clips that hold each utensil in place.

- Outside size: 210 × 46 × 24 mm, with every edge rounded
- Base: spoon and fork nested together, held by 2 snap clips on the handles
- Lid: knife held by 2 snap clips on the inside
- The lid clicks onto a lip on the base, and a finger notch on the front helps you open it

## Files
- `cutlery_case_plate.stl`: base and lid side by side, ready to print together
- `cutlery_case_base.stl`, `cutlery_case_lid.stl`: each part on its own
- `cutlery_case.scad`: parametric source

## Fit the clips to your cutlery
Measure your cutlery with a ruler or calipers, then set these in the .scad file and export again:
- `spoon_handle_w`: handle width where the clips grab, 120 mm from the head end (default 14)
- `stack_t`: spoon and fork stacked together, thickness at that point (default 7)
- `knife_handle_w`, `knife_t`: knife handle width and thickness (defaults 13 and 5)
- `base_clip_x`, `lid_clip_x`: where the clips sit along the case
- `grip`: how far the hooks reach over the handle (0.8 by default; use less if the handles are hard to clip in)

## Print settings
- PETG, 0.2 mm layers, 3 walls, 15 % infill, no supports
- Print as laid out: the base open side up, the lid top face down. The edges that touch the bed are angled so they print cleanly.
- Needs a bed that takes 210 mm. For smaller printers, reduce `length`.
- About 54 cm³ of solid model, roughly 40–50 g of filament

## Lid fit
- Too tight: set `clearance = 0.3` or `snap_bump = 0.3`
- Too loose: set `snap_bump = 0.55`
