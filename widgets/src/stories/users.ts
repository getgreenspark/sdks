interface IUser {
  apiKey: string
  integrationSlug: string
}

export const PREVIEWS_USER: IUser = {
  integrationSlug: 'GS_PREVIEW',
  apiKey: '6kQypJppcK9F5FMGHxUM53rc3Kx%2FPFz%2Bi3wni6geNSf%2FIbUq06e5KES8IyR7bKViR11ZM5AabP',
}

const SINGULAR_STORE: IUser = {
  integrationSlug: 'greenspark-development-store-widget-sdk-storybook-singular.myshopify.com',
  apiKey: '%2FugzIyv04LoEscwfOFe6TKTwc%2FgSzNCJSg3rBeDmpH2DNWTUm0YyQrNj%2BIt3q51%2BvE0gz2%2',
}

const SINGULAR_BILLING: IUser = {
  integrationSlug: '-storybook-demo---singular--stripe-56010',
  apiKey: '%2FugzIyv04LoEscwfOFe6TKTwc%2FgSzNCJSg3rBeDmpH2DNWTUm0YyQrNj%2BIt3q51%2BvE0gz2%2',
}

const PLURAL_STORE: IUser = {
  integrationSlug: 'greenspark-development-store-widget-sdk-storybook.myshopify.com',
  apiKey: '6kQypJppcK9F5FMGHxUM53rc3Kx%2FPFz%2Bi3wni6geNSf%2FIbUq06e5KES8IyR7bKViR11ZM5AabP',
}

const PLURAL_BILLING: IUser = {
  integrationSlug: 'storybook-demo-stripe-54511',
  apiKey: '6kQypJppcK9F5FMGHxUM53rc3Kx%2FPFz%2Bi3wni6geNSf%2FIbUq06e5KES8IyR7bKViR11ZM5AabP',
}

export const STORE_USERS = {
  SINGULAR: SINGULAR_STORE,
  PLURAL: PLURAL_STORE,
} as const

export const BILLING_USERS = {
  SINGULAR: SINGULAR_BILLING,
  PLURAL: PLURAL_BILLING,
} as const
