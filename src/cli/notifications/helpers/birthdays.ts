import { normaliseIndents } from "@alextheman/utility";

interface Birthday {
  date: Date;
  getMessage: (age: number) => string;
}

const birthdays: Record<string, Birthday> = {
  alex: {
    date: new Date("2003-07-16T00:00:00.000Z"),
    getMessage: (age) => {
      return normaliseIndents`
                Happy birthday to AlexMan123456, my creator! 🎉
                He has turned ${age} years old today!
            `;
    },
  },
  "alex-c-line": {
    date: new Date("2025-07-20T00:00:00.000Z"),
    getMessage: (age) => {
      return normaliseIndents`
                Happy birthday to me, alex-c-line! 🎉
                I have turned ${age} years old today!
            `;
    },
  },
};

export default birthdays;
