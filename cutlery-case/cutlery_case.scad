// Crew Cutlery Case - slim travel box with snap-on lid
// Holds a full fork / knife / spoon set (or chopsticks) for a crew bag.
// Two parts: base + lid. Lid snaps over a lip on the base.
// Units: mm. Print in PETG. Change values below, F6, export STL.

/* [What to render] */
part = "plate";   // [plate, base, lid, assembled]

/* [Size] */
length   = 205;   // outer length (fits cutlery up to ~195 mm)
width    = 52;    // outer width
corner_r = 10;    // rounded ends
base_h   = 20;    // base height up to the shoulder
lid_h    = 9;     // lid height

/* [Walls & fit] */
base_wall = 3.0;
lid_wall  = 1.4;
floor_t   = 1.6;
top_t     = 1.6;
clearance = 0.2;  // gap between lip and lid (raise to 0.3 if too tight)
lip_h     = 5;

/* [Snap] */
snap_len   = 40;   // length of snap ridge on each long side
snap_bump  = 0.45; // how far the ridge sticks out (more = firmer click)
snap_z     = 2.5;  // ridge height above the shoulder

/* [Extras] */
thumb_notch = true;
lanes       = 0;   // 0 = open, 2 = two low rails giving 3 lanes

$fn = 72;

lip_out = lid_wall + clearance;           // lip outer inset from outside
lip_in  = base_wall;                      // lip inner inset (= cavity)

module rr(l, w, h, r, inset=0) {
    // rounded rectangle prism, inset on all sides
    ri = max(r - inset, 0.5);
    translate([inset, inset, 0])
    hull() for (x=[ri, l-2*inset-ri], y=[ri, w-2*inset-ri])
        translate([x, y, 0]) cylinder(r=ri, h=h);
}

// triangular ridge along X, sticking out in -Y (front) by d, height 2*d+0.6
module ridge(len, d) {
    h = 2*d + 0.6;
    rotate([90,0,90]) linear_extrude(len, center=true)
        polygon([[0,-h/2],[d,-0.3],[d,0.3],[0,h/2]]);
}

module base() {
    difference() {
        union() {
            rr(length, width, base_h, corner_r);
            // lip
            difference() {
                rr(length, width, base_h + lip_h, corner_r, lip_out);
                translate([0,0,-1]) rr(length, width, base_h + lip_h + 2, corner_r, lip_in);
            }
            // snap ridges on the lip, both long sides
            for (side=[0,1])
                translate([length/2, side ? width-lip_out : lip_out, base_h + snap_z])
                    mirror([0, 1-side, 0]) ridge(snap_len, snap_bump);
        }
        // cavity
        translate([0,0,floor_t]) rr(length, width, base_h + lip_h, corner_r, base_wall);
        // thumb notch just under the shoulder, front side
        if (thumb_notch)
            translate([length/2, -1, base_h - 3.2])
                hull() for (dx=[-9, 9]) translate([dx, 0, 0])
                    rotate([-90,0,0]) cylinder(r=3.2, h=1.2 + 1);
    }
    // optional lane rails
    if (lanes > 0)
        for (i=[1:lanes]) {
            y = base_wall + i*(width - 2*base_wall)/(lanes+1);
            translate([corner_r+6, y-0.6, 0]) cube([length-2*corner_r-12, 1.2, floor_t + 6]);
        }
}

module lid() {
    // modelled upside-down as it prints: top face on the bed (z=0)
    difference() {
        rr(length, width, lid_h, corner_r);
        translate([0,0,top_t]) rr(length, width, lid_h, corner_r, lid_wall);
        // snap grooves, matching the ridges (a bit longer + deeper)
        for (side=[0,1])
            translate([length/2, side ? width-lid_wall : lid_wall, lid_h - snap_z])
                mirror([0, side, 0]) mirror([0,1,0]) ridge(snap_len + 4, snap_bump + 0.15);
    }
}

if (part == "base") base();
else if (part == "lid") lid();
else if (part == "assembled") {
    color("#d9e2ec") base();
    color("#c8102e") translate([0, width, base_h + lid_h]) rotate([180,0,0]) lid();
}
else { // plate: both parts side by side, ready to print
    base();
    translate([0, width + 8, 0]) lid();
}
