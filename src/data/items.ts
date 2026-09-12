export type LostFoundItem = {
  id: number;
  title: string;
  type: "Lost" | "Found";
  category: string;
  location: string;
  date: string;
  image: string;
  description: string;

  // Used for ownership verification
  verificationQuestion: string;
  verificationAnswer: string;

  // Information that should only be shown after verification
  founderName: string;
  founderContact: string;
};

export const exampleItems: LostFoundItem[] = [
  {
    id: 1,
    title: "Black Leather Backpack",
    type: "Lost",
    category: "Bags",
    location: "Central Park",
    date: "AUG 24, 2026",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description:
      "Black leather backpack lost near the central park entrance. Contains a notebook, charger and a few personal items.",
    verificationQuestion:
      "What color is the notebook inside the backpack?",
    verificationAnswer: "blue",
    founderName: "Rahul Sharma",
    founderContact: "+91 98765 43210",
  },

  {
    id: 2,
    title: "Silver Wireless Headphones",
    type: "Found",
    category: "Electronics",
    location: "Subway Line 4",
    date: "AUG 23, 2026",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description:
      "Silver wireless headphones found on a seat while travelling on Line 4.",
    verificationQuestion:
      "What color is the carrying case of the headphones?",
    verificationAnswer: "black",
    founderName: "Aditya Singh",
    founderContact: "+91 98765 12345",
  },

  {
    id: 3,
    title: "Brown Leather Wallet",
    type: "Lost",
    category: "Wallets",
    location: "Main City Cafe",
    date: "AUG 22, 2026",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
    description:
      "Brown leather wallet left on a table outside the cafe. Contains identification cards and some cash.",
    verificationQuestion:
      "What color is the bank card inside the wallet?",
    verificationAnswer: "blue",
    founderName: "Vivek Kumar",
    founderContact: "+91 98111 22334",
  },

  {
    id: 4,
    title: "Set of Car Keys",
    type: "Found",
    category: "Keys",
    location: "City Library",
    date: "AUG 21, 2026",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80",
    description:
      "Set of car keys found near the entrance of the main library building.",
    verificationQuestion:
      "What color is the keychain attached to the keys?",
    verificationAnswer: "red",
    founderName: "Arjun Mehta",
    founderContact: "+91 97654 33221",
  },

  {
    id: 5,
    title: "Blue Water Bottle",
    type: "Lost",
    category: "Accessories",
    location: "University Campus",
    date: "AUG 20, 2026",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    description:
      "Blue insulated water bottle misplaced somewhere around the university campus.",
    verificationQuestion:
      "What sticker is placed on the bottle?",
    verificationAnswer: "mountain",
    founderName: "Karan Verma",
    founderContact: "+91 99887 66554",
  },

  {
    id: 6,
    title: "Black Smart Watch",
    type: "Found",
    category: "Electronics",
    location: "Metro Station",
    date: "AUG 19, 2026",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description:
      "Black smartwatch found near the ticket counter at the metro station.",
    verificationQuestion:
      "What color is the watch strap?",
    verificationAnswer: "black",
    founderName: "Neeraj Gupta",
    founderContact: "+91 98712 44567",
  },

  {
    id: 7,
    title: "White Earbuds Case",
    type: "Lost",
    category: "Electronics",
    location: "Food Court",
    date: "AUG 18, 2026",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
    description:
      "White earbuds case lost somewhere around the food court.",
    verificationQuestion:
      "What is printed on the back of the case?",
    verificationAnswer: "initials",
    founderName: "Rohit Joshi",
    founderContact: "+91 98221 55443",
  },

  {
    id: 8,
    title: "Brown Sunglasses",
    type: "Found",
    category: "Accessories",
    location: "Railway Station",
    date: "AUG 17, 2026",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    description:
      "Brown sunglasses found on a bench near platform 2.",
    verificationQuestion:
      "What color is the sunglasses case?",
    verificationAnswer: "green",
    founderName: "Aman Bhatia",
    founderContact: "+91 98989 22110",
  },

  {
    id: 9,
    title: "Grey Laptop Sleeve",
    type: "Lost",
    category: "Bags",
    location: "Co-working Space",
    date: "AUG 16, 2026",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description:
      "Grey laptop sleeve left behind in the second-floor meeting area.",
    verificationQuestion:
      "What laptop brand was inside the sleeve?",
    verificationAnswer: "dell",
    founderName: "Harsh Kapoor",
    founderContact: "+91 97111 77889",
  },

  {
    id: 10,
    title: "Red Umbrella",
    type: "Found",
    category: "Other",
    location: "Bus Terminal",
    date: "AUG 15, 2026",
    image:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=900&q=80",
    description:
      "Red umbrella found near the waiting area of the main bus terminal.",
    verificationQuestion:
      "What is written on the umbrella handle?",
    verificationAnswer: "sun",
    founderName: "Mohit Agarwal",
    founderContact: "+91 99001 44556",
  },
];