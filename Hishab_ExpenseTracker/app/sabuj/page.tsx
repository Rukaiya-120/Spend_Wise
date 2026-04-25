"use client";


import { expenseApi } from "@/lib/api";

export default function SabujPage() {

    // http://expense-management-api.test/api/categories?context_id=019db8b6-d5de-7040-8852-3ad6c12ce82e

    const id = '019db8b6-d5de-7040-8852-3ad6c12ce82e';
    const getCategories = async () => {

      const result=  await expenseApi.getCategories({ context_id: id })
      console.log(result)
    }

  return (
    <div>
      <h1>Sabuj Page</h1>
      <button onClick={getCategories}>Get Categories</button>
      <p>This is the Sabuj page content.</p>
    </div>
  );
}