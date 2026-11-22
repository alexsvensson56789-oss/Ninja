// Crew Utensil Caddy - compact cutlery holder for a cabin-crew trolley top
// Parametric: edit the values below, then F6 (render) and export STL.
// Units: millimetres. Recommended material: PETG (handles hot-galley temps
// and dishwashing better than PLA).

/* [Overall size] */
length      = 170;   // left-right
depth       = 66;    // front-back
back_height = 92;    // tall back edge (holds cutlery upright)
front_height= 68;    // lower front edge so it's easy to grab from
corner_r    = 7;     // outer corner rounding

/* [Walls] */
wall        = 2.4;   // outer wall (6 perimeters @0.4 nozzle)
floor_t     = 2.4;
divider     = 1.8;

/* [Compartments] - widths from left to right; last cell is the
   narrow pocket for stirrers / teaspoons / sugar sticks.
   The narrow last cell is sized automatically to fill the rest. */
main_cells = [46, 46, 46];

/* [Extras] */
drain_holes   = true;  // small slots in each cell floor for rinsing/drying
foot_recesses = true;  // pockets for 10 mm self-adhesive silicone bumpers
grip_notch    = true;  // finger scoop on both short ends
top_chamfer   = 0.8;

$fn = 64;

last_cell = length - 2*wall - len(main_cells)*divider - sum(main_cells, len(main_cells));
cells = concat(main_cells, [last_cell]);
assert(last_cell > 12, "Compartments too wide for the chosen length");

module rounded_box(l, d, h, r) {
    // box with vertical edges rounded
    hull() for (x=[r, l-r], y=[r, d-r]) translate([x,y,0]) cylinder(r=r, h=h);
}

module slope_cut() {
    // removes everything above a plane sloping from back_height (back)
    // down to front_height (front)
    a = atan((back_height-front_height)/depth);
    translate([-1, 0, front_height]) rotate([a,0,0])
        translate([0,-depth,0]) cube([length+2, depth*3, back_height]);
}

module body() {
    difference() {
        rounded_box(length, depth, back_height, corner_r);
        // hollow cells
        x0 = wall;
        for (i=[0:len(cells)-1]) {
            xs = x0 + sum(cells, i) + i*divider;
            ri = (i==0 || i==len(cells)-1) ? corner_r-wall : 1.5;
            translate([xs, wall, floor_t])
                cell_cavity(cells[i], depth-2*wall, back_height, max(ri,1.5));
        }
        slope_cut();
    }
}

// cavity rounded on all vertical edges + soft fillet at the floor
module cell_cavity(w, d, h, r) {
    hull() {
        for (x=[r, w-r], y=[r, d-r]) {
            translate([x,y,3]) cylinder(r=r, h=h);
            translate([x,y,0]) cylinder(r=max(r-2,0.5), h=h);
        }
    }
}

function sum(v, n) = n<=0 ? 0 : v[n-1] + sum(v, n-1);

module drains() {
    for (i=[0:len(cells)-1]) {
        xs = wall + sum(cells, i) + i*divider;
        cx = xs + cells[i]/2;
        for (dy=[-14, 0, 14])
            translate([cx, depth/2+dy, -1])
                hull() for (dx=[-cells[i]/4+3, cells[i]/4-3])
                    translate([dx,0,0]) cylinder(d=3, h=floor_t+2, $fn=24);
    }
}

module feet() {
    inset = 12;
    for (x=[inset, length-inset], y=[inset, depth-inset])
        translate([x,y,-1]) cylinder(d=10.6, h=1+1.0);
}

module notches() {
    // finger scoop on the short ends, near the top
    for (x=[-1, length+1])
        translate([x, depth/2, front_height+4])
            rotate([0,90,0]) scale([1.2,1,1]) cylinder(d=26, h=wall*4, center=true);
}

module caddy() {
    difference() {
        body();
        if (drain_holes)   drains();
        if (foot_recesses) feet();
        if (grip_notch)    notches();
    }
}

caddy();
