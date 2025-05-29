import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

export async function getApodByDate(date: string) {
  
  const cached = await prisma.apod.findUnique({ where: { date } });
  if (cached) return cached;

  
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${NASA_API_KEY}`
  );

  if (!res.ok) throw new Error("Failed to fetch from NASA");

  const data = await res.json();

  
  const saved = await prisma.apod.create({
    data: {
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      media_type: data.media_type,
    },
  });

  return saved;
}
