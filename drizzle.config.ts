import type { Config } from 'drizzle-kit'

export default {
  schema: "./backend/db/schema.ts",
  out: "./backend/db/migrations",
  driver: 'turso',
  dbCredentials: {
    url: "libsql://explorer-mckamyk.turso.io",
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTE1VDIxOjIxOjA2LjE5NjE5NjM2NVoiLCJpZCI6ImIwOTIzMjZiLWIzZWItMTFlZS05OTAxLTc2MWQzZmIxZTMzMSJ9.ziPTKgARmLXlDEgHh8r5eTjcYFC3RRNC5F30TiSxPWc1bI0v1Ik5g97QtsaX3rLztjfjgd-TWeyxKw_WfsxSAw'
  }
} as Config
