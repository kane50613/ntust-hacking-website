import { db } from ".";
import { faker } from "@faker-js/faker/locale/zh_TW";
import { enrolls, events, feedbacks, users } from "./schema";

const eventNames = [
  "明天社聚開打 HackTheBox ㄉ Pro Labs",
  "Windows 漏洞利用開發",
  "此次社聚將會挑戰 HTB 的 Pro Labs !!!!",
  "社團聚會── CTF Battle",
  "Windows 逆向工程",
  "社團聚會--Tryhackme Night",
  "數位鑑識",
];

export async function seedDb() {
  const eventRecords = await db
    .insert(events)
    .values(
      Array.from({ length: 10 }, () => ({
        title: eventNames[Math.floor(Math.random() * eventNames.length)],
        description: faker.lorem.sentences(3),
        date: faker.date.future(),
      }))
    )
    .returning();

  const userRecords = await db
    .insert(users)
    .values(
      Array.from({ length: 200 }, () => ({
        discordId: faker.number.bigInt(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      }))
    )
    .returning();

  for (const eventRecord of eventRecords) {
    const enrollRecords = await db
      .insert(enrolls)
      .values(
        userRecords.map((userRecord) => ({
          eventId: eventRecord.eventId,
          userId: userRecord.userId,
        }))
      )
      .returning();

    await db.insert(feedbacks).values(
      enrollRecords.map((enroll) => ({
        enrollId: enroll.enrollId,
        comment: faker.lorem.sentences(3),
        rating: Math.floor(Math.random() * 5),
      }))
    );
  }

  console.log("Seeded database");
}

await seedDb();

process.exit(0);
