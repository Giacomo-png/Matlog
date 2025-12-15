export type Move = {
  slug: string;
  name: string;
  category:
    | "Submission"
    | "Pass"
    | "Sweep"
    | "Guard"
    | "Takedown"
    | "Escape"
    | "Transition";
  description: string;
  videoUrl?: string;
};

export const MOVES: Move[] = [
  // SUBMISSIONS (5+)
  {
    slug: "armbar",
    name: "Armbar",
    category: "Submission",
    description:
      "Arm isolieren, Hüfte nah an die Schulter bringen, Daumen nach oben kontrollieren und Hüfte strecken.",
    videoUrl: "https://youtu.be/GshEzcqlUbY?si=eg6umHxGu8NJ6RPa",
  },
  {
    slug: "triangle-choke",
    name: "Triangle Choke",
    category: "Submission",
    description:
      "Arm kontrollieren, Winkel schaffen, Beine um den Nacken schließen und Hüfte strecken.",
    videoUrl: "https://youtu.be/20j7LcZ5xRY?si=ZfSTlBWi1U_ILevl",
  },
  {
    slug: "rear-naked-choke",
    name: "Rear Naked Choke",
    category: "Submission",
    description:
      "Von Back Control den Nacken umschließen, Griff hinter dem Kopf verstecken und Druck mit Rücken und Armen aufbauen.",
    videoUrl: "https://youtu.be/l8-JI7NND3E?si=uNyOirXcnHDIlaAG",
  },
  {
    slug: "kimura",
    name: "Kimura",
    category: "Submission",
    description:
      "Figure-Four-Griff am Arm, Ellbogen vom Körper lösen und Schulter mit Rotation kontrollieren.",
    videoUrl: "https://youtu.be/xyCakxmx-2E?si=wtko5o2nGFk6H3wM",
  },
  {
    slug: "americana",
    name: "Americana",
    category: "Submission",
    description:
      "Handgelenk fixieren, Ellbogen nach unten führen und Schulter nach außen rotieren.",
    videoUrl: "https://youtu.be/WLqWGE4YgT8?si=pGip8GlmJCrObbsQ",
  },
  {
    slug: "guillotine-choke",
    name: "Guillotine Choke",
    category: "Submission",
    description:
      "Kopf unter dem Arm fangen, Handfläche greifen, Ellbogen nach unten ziehen und Hüfte nach vorn bringen.",
    videoUrl: "https://youtu.be/bEo7bj0lxUY?si=QDyNr4ItD7siElk8",
  },

  // PASSES (5+)
  {
    slug: "knee-cut-pass",
    name: "Knee Cut Pass",
    category: "Pass",
    description:
      "Knie durch die Guard schneiden, Oberkörperdruck halten und zur Seite kontrol­liert durchpassen.",
    videoUrl: "https://youtu.be/F1Nd4MmLuDk?si=mDKW2eT11t2F3MgG",
  },
  {
    slug: "toreando-pass",
    name: "Toreando Pass",
    category: "Pass",
    description:
      "Beine seitlich weglenken, Hüfte weg halten und seitlich um die Guard herumgehen.",
    videoUrl: "https://youtu.be/i9rA2rDb05k?si=SK67MxHpb7IiYYzh",
  },
  {
    slug: "double-under-pass",
    name: "Double Under Pass",
    category: "Pass",
    description:
      "Beide Beine unterhaken, Hüfte stapeln, Druck auf den Oberkörper bringen und zur Seite passen.",
    videoUrl: "https://youtu.be/PizdshB63kw?si=mtEk5p3P-o9ajX-d",
  },
  {
    slug: "over-under-pass",
    name: "Over Under Pass",
    category: "Pass",
    description:
      "Ein Bein über, ein Bein unterhaken, Hüfte kontrollieren und mit Druck zur Seite durchpassen.",
    videoUrl: "https://youtu.be/fZHugosJvh8?si=ujLYzz0wBvxQzGCY",
  },
  {
    slug: "leg-drag-pass",
    name: "Leg Drag Pass",
    category: "Pass",
    description:
      "Bein diagonal über die eigene Hüfte ziehen, Knie einklemmen und zur Seite in Kontrolle übergehen.",
    videoUrl: "https://youtu.be/9WamuarRD20?si=c9tfFheBM5xI2qcw",
  },

  // SWEEPS (5+)
  {
    slug: "scissor-sweep",
    name: "Scissor Sweep",
    category: "Sweep",
    description:
      "Oberkörper mit Griffen kontrollieren, ein Schienbein quer legen und mit Scherenbewegung zum Top kommen.",
    videoUrl: "https://youtu.be/fcZJvERQcw0?si=Yz5ziHL3G5TPwFdh",
  },
  {
    slug: "hip-bump-sweep",
    name: "Hip Bump Sweep",
    category: "Sweep",
    description:
      "Aufsetzen aus Guard, Arm blockieren und Hüfte explosiv in den Gegner treiben, um ihn umzukippen.",
    videoUrl: "https://youtu.be/42tl59plPBo?si=ta5yLfdbLZOWv9iw",
  },
  {
    slug: "flower-sweep",
    name: "Flower (Pendulum) Sweep",
    category: "Sweep",
    description:
      "Arm kontrollieren, Bein pendeln lassen und mit Schwung die Basis des Gegners wegnehmen.",
    videoUrl: "https://youtu.be/8zuFg-PigDc?si=LhlII2RqEh3yKDWi",
  },
  {
    slug: "tripod-sweep",
    name: "Tripod Sweep",
    category: "Sweep",
    description:
      "Ein Bein kontrollieren, das andere Bein an der Hüfte platzieren und das Standbein wegziehen.",
    videoUrl: "https://youtu.be/iGhMeN3TUPM?si=fDnpBZRSGf4LaRvz",
  },
  {
    slug: "lumberjack-sweep",
    name: "Lumberjack Sweep",
    category: "Sweep",
    description:
      "Beide Fersen greifen, Füße an der Hüfte platzieren und Beine gleichzeitig hochziehen.",
    videoUrl: "https://youtu.be/NfgvFpvuzkQ?si=8qem-VSOhXyZiLIk",
  },

  // GUARD (5+)
  {
    slug: "closed-guard",
    name: "Closed Guard",
    category: "Guard",
    description:
      "Beine geschlossen um den Oberkörper, Haltung brechen und Arme kontrollieren.",
    videoUrl: "https://youtu.be/otskR_OjuBU?si=spXmonuCgavxZgrq",
  },
  {
    slug: "half-guard",
    name: "Half Guard",
    category: "Guard",
    description:
      "Ein Bein des Gegners kontrollieren, Kopf- und Underhook-Kampf entscheiden die Position.",
    videoUrl: "https://youtu.be/E8x1Cva8hJ8?si=yc6lUSHTIyxFlJK0",
  },
  {
    slug: "open-guard",
    name: "Open Guard",
    category: "Guard",
    description:
      "Beine offen, Distanz mit Füßen an Hüfte/Armen kontrollieren und Griffe aktiv nutzen.",
    videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID",
  },
  {
    slug: "butterfly-guard",
    name: "Butterfly Guard",
    category: "Guard",
    description:
      "Beide Haken innen an den Oberschenkeln, Oberkörper mit Griffen kontrollieren und auf Sweeps arbeiten.",
    videoUrl: "https://youtu.be/_3braRnOwFo?si=4SnutrnzC4dRjFKn",
  },
  {
    slug: "spider-guard",
    name: "Spider Guard",
    category: "Guard",
    description:
      "Ärmelgriffe mit Füßen in den Bizeps, starke Kontrolle über Distanz und Arme des Gegners.",
    videoUrl: "https://youtu.be/zoabs7H2ZN8?si=pYXMkmrjk6E6FsWz",
  },

  // TAKEDOWNS (5+)
  {
    slug: "single-leg",
    name: "Single Leg",
    category: "Takedown",
    description:
      "Ein Bein greifen, Balance brechen und mit Vortrieb oder Trip zum Boden bringen.",
    videoUrl: "https://youtu.be/4HBVdF5AXc0?si=0nMAn0rJX5LwSZMc",
  },
  {
    slug: "double-leg",
    name: "Double Leg",
    category: "Takedown",
    description:
      "Level-Change, beide Beine fassen, seitlich abdrehen und Gegner zu Boden fahren.",
    videoUrl: "https://youtu.be/4DHzLvLd-0Y?si=LbKcBWxep9WGjc5Z",
  },
  {
    slug: "ankle-pick",
    name: "Ankle Pick",
    category: "Takedown",
    description:
      "Kopf- oder Kragenkontrolle, Fuß greifen und durch Zug an Kopf und Schub am Fuß kippen.",
    videoUrl: "https://youtu.be/FfCZQXZ6eqY?si=qv0VEDX4dmKoAapx",
  },
  {
    slug: "osoto-gari",
    name: "Osoto Gari",
    category: "Takedown",
    description:
      "Seitlich stehen, Oberkörper zurückziehen und äußeres Bein des Gegners wegfegen.",
    videoUrl: "https://youtu.be/ommBYBxcCuE?si=TbRfcRT8R3-fwlO2",
  },
  {
    slug: "arm-drag-to-back",
    name: "Arm Drag to Back Take",
    category: "Takedown",
    description:
      "Arm ziehen, an der Seite vorbeigehen und Rücken übernehmen, oft vom Stand oder Sitzen.",
    videoUrl: "https://youtu.be/e_c7G5T_ZR8?si=jQpG6X2tXOT9rrnv",
  },

  // ESCAPES (5+)
  {
    slug: "shrimp-escape",
    name: "Shrimp Escape",
    category: "Escape",
    description:
      "Hüfte zur Seite schieben, Knie einschieben und zur Guard oder auf Abstand kommen.",
    videoUrl: "https://youtu.be/4J75b9zFdgM?si=XjGC_uDtEYtj7CaS",
  },
  {
    slug: "upa-mount-escape",
    name: "Upa Mount Escape",
    category: "Escape",
    description:
      "Arm und Bein auf einer Seite blockieren, Hüfte explosiv anheben und den Gegner überrollen.",
    videoUrl: "https://youtu.be/FmvDMTfiJR4?si=ICwuU-lRFT90qK-q",
  },
  {
    slug: "elbow-knee-escape-mount",
    name: "Elbow-Knee Escape (Mount)",
    category: "Escape",
    description:
      "Ellbogen und Knie verbinden, Hüfte seitlich schieben und Bein zwischen euch bringen.",
    videoUrl: "https://youtube.com/shorts/8T2SXB-4Fd8?si=xwVYN8V_OVvS3Zmv",
  },
  {
    slug: "side-control-escape",
    name: "Side Control Escape",
    category: "Escape",
    description:
      "Frames am Hals und Hüfte, Hüfte wegschieben und Knie einschieben, um Guard zurückzuholen.",
    videoUrl: "https://youtu.be/R4-4wiHam98?si=sXq0E-CkWtEbkZ2Y",
  },
  {
    slug: "back-escape",
    name: "Back Escape",
    category: "Escape",
    description:
      "Kinn schützen, auf die „schwache Seite“ rollen und Hüfte aus der Rückenposition drehen.",
    videoUrl: "https://youtu.be/uT-7lJxykCg?si=MdPZ46XJQ9wwz8y1",
  },

  // TRANSITIONS (neu, 5+)
  {
    slug: "guard-to-mount",
    name: "Guard to Mount Transition",
    category: "Transition",
    description:
      "Aus Guard Balance brechen, Hüfte über den Gegner schieben und Knie in die Mount bringen.",
    videoUrl: "https://youtu.be/3KCm38aFuV8?si=b62wphYvM7T5HGlW",
  },
  {
    slug: "side-control-to-mount",
    name: "Side Control to Mount",
    category: "Transition",
    description:
      "Knie über den Bauch gleiten lassen oder Schritt über das Bein, um in die Mount zu wechseln.",
    videoUrl: "https://youtu.be/zqQx9SsgdBw?si=YnJ2u_9frmv8vOmK",
  },
  {
    slug: "mount-to-back-take",
    name: "Mount to Back Take",
    category: "Transition",
    description:
      "Wenn der Gegner sich dreht, Haken setzen und Oberkörper kontrolliert auf den Rücken wechseln.",
    videoUrl: "https://youtu.be/0xsus1ksJSc?si=exdPdnubWun3966y",
  },
  {
    slug: "turtle-to-back-take",
    name: "Turtle to Back Take",
    category: "Transition",
    description:
      "Seatbelt sichern, einen Haken setzen und seitlich oder diagonal auf den Rücken rutschen.",
    videoUrl: "https://youtu.be/B8fR6C2nP3s?si=z6izsfCr2DX2UG4L",
  },
  {
    slug: "half-guard-to-side-control",
    name: "Half Guard to Side Control",
    category: "Transition",
    description:
      "Kopf und Underhook kontrollieren, Bein befreien und Hüfte durchbringen, um Side Control zu sichern.",
    videoUrl: "https://youtu.be/l5NuoOb0c_0?si=o90FhTpKtw5QBNCd",
  },
];
