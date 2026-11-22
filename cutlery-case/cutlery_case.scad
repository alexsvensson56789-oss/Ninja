// Crew Cutlery Case v2 - slim, rounded travel case with snap-in utensil clips
// Base: spoon + fork (nested) held by two snap clips.
// Lid:  knife held by two snap clips on the inside of the lid.
// Lid snaps over a lip on the base. Units: mm. Print in PETG.

/* [What to render] */
part = "plate";   // [plate, base, lid, assembled, open]

/* [Body] */
length   = 210;   // outer length (cutlery up to ~200 mm)
width    = 46;    // outer width (spoon bowl up to ~40 mm)
height   = 24;    // total closed height
split    = 16;    // base height (lid = height - split)
end_r    = 16;    // plan-view corner radius (bigger = more pill-shaped)
edge_r   = 5;     // top/bottom edge rounding

/* [Walls & fit] */
base_wall = 2.8;
lid_wall  = 1.4;
floor_t   = 1.6;
top_t     = 1.6;
clearance = 0.2;  // lip-to-lid gap (0.3 if too tight)
lip_h     = 4;

/* [Lid snap] */
snap_len  = 40;
snap_bump = 0.4;
snap_z    = 2;

/* [Utensil clips] - measure your cutlery! */
spoon_handle_w = 14;  // widest part of spoon/fork handle where the clips sit
stack_t        = 7;   // spoon + fork nested, thickness at the clips
knife_handle_w = 13;  // knife handle width where the clips sit
knife_t        = 5;   // knife handle thickness
grip           = 0.8; // how far each clip lip hooks over the handle
clip_t         = 1.6; // clip arm thickness (thinner = softer)
clip_len       = 9;
base_clip_x    = [110, 175];  // clip positions along the case (head end at x=0)
lid_clip_x     = [120, 180];

$fn = 64;

// ---------- rounded body ----------
// corner profile: round edge on top, 45-degree "teardrop" edge on the side
// that touches the print bed so it prints cleanly without supports
module corner(r, h, rf, bed_at_bottom) {
    cx = r - rf;
    rotate_extrude($fn=64) hull() {
        square([0.01, h]);
        translate([cx, h - rf]) circle(rf);
        translate([cx, rf]) circle(rf);
        if (bed_at_bottom) square([cx + 0.414*rf, 0.01]);
        else translate([0, h-0.01]) square([cx + 0.414*rf, 0.01]);
    }
}
module body(l, w, h, r, rf, inset=0, bed_at_bottom=true) {
    ri = r - inset; rfi = max(rf - inset, 0.6);
    translate([inset, inset, 0])
    hull() for (x=[ri, l-2*inset-ri], y=[ri, w-2*inset-ri])
        translate([x, y, 0]) corner(ri, h, rfi, bed_at_bottom);
}
module prism(inset, h) {            // straight-walled rounded rectangle
    ri = end_r - inset;
    translate([inset, inset, 0])
    hull() for (x=[ri, length-2*inset-ri], y=[ri, width-2*inset-ri])
        translate([x, y, 0]) cylinder(r=ri, h=h);
}

module ridge(len, d) {              // triangular ridge, points +Y
    h = 2*d + 0.6;
    rotate([90,0,90]) linear_extrude(len, center=true)
        polygon([[-0.4,-h/2],[0,-h/2],[d,-0.3],[d,0.3],[0,h/2],[-0.4,h/2]]);
}

// ---------- utensil clip ----------
// two flexible arms with hooked tops; push the handle down between them
module clip(handle_w, thick) {
    arm_h = thick + 1.6;
    for (s=[-1, 1]) {
        y0 = s * (handle_w/2 + 0.15);
        translate([0, y0, 0]) mirror([0, s<0 ? 1 : 0, 0])
        rotate([90,0,90]) linear_extrude(clip_len, center=true)
            polygon([
                [0, 0], [clip_t, 0],           // foot (outer side)
                [clip_t, arm_h],               // outer face up
                [-grip, arm_h - 0.4],          // sloped top = lead-in
                [-grip, thick + 0.2],          // hook underside
                [0, thick + 0.2 - grip]        // 45-deg back to the arm (printable)
            ]);
    }
    // little rest pad so the handle sits flat
    translate([-clip_len/2, -handle_w/2 + 1, 0]) cube([clip_len, handle_w - 2, 0.6]);
}

// ---------- parts ----------
module base() {
    difference() {
        union() {
            intersection() {
                body(length, width, height, end_r, edge_r);
                translate([-1,-1,0]) cube([length+2, width+2, split]);
            }
            difference() {            // lip
                prism(lid_wall + clearance, split + lip_h);
                translate([0,0,-1]) prism(base_wall, split + lip_h + 2);
            }
            for (side=[0,1])          // lid snap ridges
                translate([length/2, side ? width-lid_wall-clearance : lid_wall+clearance, split + snap_z])
                    mirror([0, 1-side, 0]) ridge(snap_len, snap_bump);
        }
        translate([0,0,floor_t]) body(length, width, height, end_r, edge_r, base_wall);
        // finger notch at the parting line
        translate([length/2, -1, split - 2.8])
            hull() for (dx=[-8, 8]) translate([dx,0,0]) rotate([-90,0,0]) cylinder(r=2.8, h=2.2);
    }
    for (x=base_clip_x) translate([x, width/2, floor_t - 0.01]) clip(spoon_handle_w, stack_t);
}

module lid() {   // modelled as printed: outside top on the bed
    lh = height - split;
    difference() {
        intersection() {
            translate([0, width, height]) rotate([180,0,0])
                body(length, width, height, end_r, edge_r, 0, false);
            cube([length, width, lh]);
        }
        // skirt that slides over the lip
        translate([0,0,lh - lip_h - 0.6]) prism(lid_wall, lip_h + 1);
        // main cavity
        translate([0,0,top_t]) prism(base_wall, lh);
        // snap grooves
        for (side=[0,1])
            translate([length/2, side ? width-lid_wall : lid_wall, lh - snap_z])
                mirror([0, side, 0]) mirror([0,1,0]) ridge(snap_len + 4, snap_bump + 0.15);
    }
    // knife clips
    for (x=lid_clip_x) translate([x, width/2, top_t - 0.01]) clip(knife_handle_w, knife_t);
}

if (part == "base") base();
else if (part == "lid") lid();
else if (part == "assembled") {
    color("#e8edf2") base();
    color("#c8102e") translate([0, width, height]) rotate([180,0,0]) lid();
}
else if (part == "open") {
    color("#e8edf2") base();
    color("#c8102e") translate([0, width + 10, 0]) lid();
}
else { base(); translate([0, width + 8, 0]) lid(); }
