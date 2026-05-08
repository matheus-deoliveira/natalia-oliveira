import { pgTable, text, timestamp, integer, decimal, boolean, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable("account", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}))

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (verificationToken) => ({
  compositePk: primaryKey({
    columns: [verificationToken.identifier, verificationToken.token],
  }),
}))

export const authenticators = pgTable("authenticator", {
  credentialID: text("credentialID").notNull().unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
}, (authenticator) => ({
  compositePK: primaryKey({
    columns: [authenticator.userId, authenticator.credentialID],
  }),
}))

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: integer("price").notNull(), // Salvo sempre em centavos (ex: R$ 50,00 vira 5000)
  imageUrl: text("image_url"),
  inventory: integer("inventory").default(0),

  // Melhor Envio: Dimensões físicas essenciais para cálculo de frete
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(), // Peso (kg)
  width: decimal("width", { precision: 10, scale: 2 }).notNull(),   // Largura (cm)
  height: decimal("height", { precision: 10, scale: 2 }).notNull(), // Altura (cm)
  length: decimal("length", { precision: 10, scale: 2 }).notNull(), // Comprimento (cm)
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  totalAmt: integer("total_amt").notNull(), // Salvo em centavos
  shippingCost: integer("shipping_cost").default(0), // Salvo em centavos
  shippingMethod: text("shipping_method"), // (Ex: Correios PAC)
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
