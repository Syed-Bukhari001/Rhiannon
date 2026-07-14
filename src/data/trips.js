import { asset } from "../utils/assets.js";

export const trips = [
  {
    id: "greece",
    title: "Greece Group Trip",
    destination: "Greece",
    region: "Mediterranean coast and mountains",
    dates: "Sep 5-14, 2026",
    startDate: "2026-09-05",
    endDate: "2026-09-14",
    length: "10 days",
    price: 1950,
    deposit: 400,
    difficulty: "Moderate",
    groupSize: "8-14 people",
    spotsLeft: 10,
    status: "Open",
    image: asset("assets/trip-greece.png"),
    accent: "#d9873f",
    summary:
      "Island hikes, crystal-blue seas, white villages and epic sunsets. A bucket-list adventure through the best of Greece.",
    story:
      "A sunny, social adventure through Greek trails, coastal villages, swimming spots and warm evenings with a small group of people who want more than a standard tour.",
    highlights: [
      "Coastal hikes above Aegean water",
      "Small-group dinners and local guides",
      "Swimming coves, villages and sunset viewpoints",
      "Hosted pre-trip pack and community chat",
    ],
    included: [
      "9 nights accommodation",
      "Local guide support",
      "Planned hikes and cultural stops",
      "Welcome dinner and trip pack",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Some lunches and personal spending",
      "Optional add-on activities",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival and welcome dinner",
        body: "Meet the group, settle in, and start the trip with a relaxed welcome evening.",
      },
      {
        day: "Day 2",
        title: "Cliff trails and coastal villages",
        body: "A scenic hike above turquoise water with time for photos, coffee and a slow village lunch.",
      },
      {
        day: "Day 3",
        title: "Gorge hike and swim stop",
        body: "Follow a dramatic trail through limestone terrain before a cold-water swim and sunset dinner.",
      },
      {
        day: "Day 4",
        title: "Hidden coves and local food",
        body: "A lighter day built around local culture, optional activity time and a group meal.",
      },
    ],
    adminNotes: "Balance reminders due 90 days before departure. Insurance proof required.",
  },
  {
    id: "georgia",
    title: "Georgia Group Trip",
    destination: "Georgia",
    region: "Caucasus mountains",
    dates: "Sep 26-Oct 4, 2026",
    startDate: "2026-09-26",
    endDate: "2026-10-04",
    length: "9 days",
    price: 1850,
    deposit: 350,
    difficulty: "Challenging",
    groupSize: "8-14 people",
    spotsLeft: 12,
    status: "Open",
    image: asset("assets/trip-georgia.png"),
    accent: "#b66a3c",
    summary:
      "Towering mountains, ancient culture and warm hospitality. Trek the Caucasus and discover the heart of Georgia.",
    story:
      "A rugged mountain-forward trip with big landscapes, warm guesthouses and the kind of trail days that make strangers feel like a team.",
    highlights: [
      "Caucasus ridge hikes",
      "Ancient churches and mountain villages",
      "Guesthouse stays and local food",
      "High-viewpoint photography stops",
    ],
    included: [
      "8 nights accommodation",
      "Ground transfers during itinerary",
      "Local guide support",
      "Trip briefings and packing list",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Visa or entry requirements",
      "Personal hiking kit",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Tbilisi",
        body: "Meet the group, review the route and enjoy the first dinner together.",
      },
      {
        day: "Day 2",
        title: "Into the mountains",
        body: "Transfer toward the Caucasus and take a warm-up trail through highland villages.",
      },
      {
        day: "Day 3",
        title: "Ridge walk and monastery views",
        body: "A more demanding day with huge mountain views and an iconic stone church stop.",
      },
      {
        day: "Day 4",
        title: "Valley trek and guesthouse night",
        body: "Cross green valleys, share a homemade meal and slow down under the stars.",
      },
    ],
    adminNotes: "Higher fitness level. Collect gear confirmation before final balance.",
  },
  {
    id: "peru",
    title: "Peru Waitlist",
    destination: "Peru",
    region: "Andes and sacred valleys",
    dates: "Spring 2027",
    startDate: "2027-04-12",
    endDate: "2027-04-22",
    length: "11 days",
    price: 2450,
    deposit: 450,
    difficulty: "Challenging",
    groupSize: "10-14 people",
    spotsLeft: 0,
    status: "Waitlist",
    image: asset("assets/group-sunset.png"),
    accent: "#c4733f",
    summary:
      "High-altitude trails, ancient paths and a slower adventure through the Andes.",
    story:
      "A future trip concept built for interested travellers to join early and shape the departure.",
    highlights: ["Andean trails", "Local guides", "Pre-trip altitude prep", "Waitlist first access"],
    included: ["Concept itinerary", "Waitlist updates", "Early deposit window", "Survey-based planning"],
    notIncluded: ["Flights", "Insurance", "Final route confirmation", "Optional extensions"],
    itinerary: [
      {
        day: "Preview",
        title: "Waitlist-first adventure",
        body: "Join the list and get first access when dates and final pricing go live.",
      },
    ],
    adminNotes: "Use audience survey before opening deposits.",
  },
];

export const bookings = [
  {
    id: "BK-1024",
    traveller: "Maya Thompson",
    tripId: "greece",
    status: "Deposit paid",
    paid: 400,
    balance: 1550,
    due: "Jun 7, 2026",
    room: "Twin share",
  },
  {
    id: "BK-1025",
    traveller: "Ella Morgan",
    tripId: "greece",
    status: "Form incomplete",
    paid: 400,
    balance: 1550,
    due: "Jun 7, 2026",
    room: "Private room request",
  },
  {
    id: "BK-1026",
    traveller: "Sofia Evans",
    tripId: "georgia",
    status: "Paid in full",
    paid: 1850,
    balance: 0,
    due: "Complete",
    room: "Twin share",
  },
  {
    id: "BK-1027",
    traveller: "Jess Carter",
    tripId: "georgia",
    status: "Deposit paid",
    paid: 350,
    balance: 1500,
    due: "Jun 28, 2026",
    room: "Twin share",
  },
];

export const waitlist = [
  { name: "Amelia R.", destination: "Peru", source: "Instagram story", intent: "High" },
  { name: "Nadia K.", destination: "Dolomites", source: "Link in bio", intent: "Medium" },
  { name: "Priya S.", destination: "Japan", source: "TikTok", intent: "High" },
  { name: "Megan L.", destination: "Greece", source: "YouTube", intent: "High" },
];

export const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
