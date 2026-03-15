import L from "leaflet";

export function createCustomIcon(price: number, active: boolean) {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative group h-9 w-9">
        <div class="flex h-full w-full px-2 items-center justify-center rounded-2xl border-2 shadow-2xl transition-all duration-300 transform group-hover:scale-110 ${ active? "bg-primary text-card z-20 border-card" : "bg-card text-primary z-20 border-primary"}">
          <span class="text-[14px] font-black leading-none">P</span>
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b rounded-sm ${active? "bg-primary border-card" : "bg-card border-primary"}"></div>
        </div>
      </div>
    `,
    iconSize: [52, 42],
    iconAnchor: [18, 42],
  });
}

export const userLocationIcon = L.divIcon({
  className: 'user-location-icon',
  html: `
    <div class="relative">
      <div class="absolute -inset-3 bg-primary/20 rounded-full animate-ping"></div>
      <div class="relative w-5 h-5 bg-primary border-4 border-white rounded-full shadow-2xl"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
