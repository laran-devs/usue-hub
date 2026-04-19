import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret_underground_key_777");

/**
 * Generates a random fun nickname for guest users.
 */
export function generateRandomNickname(): string {
  const adjectives = [
    "Скрытный", "Анонимный", "Веселый", "Мудрый", "Быстрый", 
    "Сонный", "Голодный", "Дерзкий", "Умный", "Странный",
    "Техногенный", "Цифровой", "Подпольный", "Крутой", "Тихий"
  ];
  const nouns = [
    "Студент", "Финансист", "Менеджер", "Хакер", "Прогер",
    "Экономист", "Юрист", "Дизайнер", "Профессор", "Ректор",
    "Староста", "Аватар", "Бот", "Киборг", "Призрак"
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  
  return `${adj} ${noun} #${num}`;
}

/**
 * Shuffles letters of a username to create an anonymous nickname.
 */
export function shuffleNickname(username: string): string {
  const chars = username.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

/**
 * Password Hashing
 */
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

/**
 * Validation Logic
 */
export function validateEmail(email: string): boolean {
  return email.endsWith("@usue.ru");
}

export function validatePassword(password: string): boolean {
  // Rule: min 8 chars, 1 number, 1 special char
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return passwordRegex.test(password);
}

/**
 * Session management helpers.
 */
export async function createSession(userId: string) {
  const session = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("auth_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as { userId: string };
  } catch {
    return null;
  }
}
