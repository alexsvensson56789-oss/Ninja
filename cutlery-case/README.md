# Crew Cutlery Case (v3: red, with a logo on the lid)

A slim, pill-shaped travel case with a snap-on lid and clips that hold each utensil in place.

- Outside size: 210 × 46 × 24 mm, with every edge rounded
- Base: spoon and fork nested together, held by 2 snap clips on the handles
- Lid: knife held by 2 snap clips on the inside
- The lid clicks onto a lip on the base, and a finger notch on the front helps you open it

## Dimensions
| | Length | Width | Height |
|---|---|---|---|
| Closed case (outside) | 210 mm | 46 mm | 24 mm |
| Base | 210 mm | 46 mm | 16 mm (20 mm including the lip) |
| Lid | 210 mm | 46 mm | 8 mm |
| Inside space | 204 mm | 40 mm | 21 mm |
| Logo area on the lid | up to 95 mm | up to 22 mm | 0.6 mm recess |

## Colour and logo
- Print the case in red PETG.
- The logo is recessed 0.6 mm into the top of the lid. You can use it in two ways:
  - **One colour:** print only the lid, and the logo shows as an engraved shape.
  - **Two colours (Bambu AMS, Prusa MMU and similar):** load `cutlery_case_lid.stl` and `cutlery_case_logo.stl` together as one object with two parts. Give the lid red and the logo white. The logo prints in the first 3 layers, flush with the surface.
- **Your own logo:** put an SVG file next to `cutlery_case.scad`, set `logo_file = "yourlogo.svg";`, then export the lid and logo STLs again. A simple one-colour outline works best. Until you do this, the lid shows the placeholder text from `logo_text` ("CREW").

## Files
- `cutlery_case_plate.stl`: base and lid side by side, ready to print together
- `cutlery_case_base.stl`, `cutlery_case_lid.stl`: each part on its own
- `cutlery_case_logo.stl`: logo inlay for a second filament colour
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
