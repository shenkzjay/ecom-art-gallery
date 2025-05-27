import React, { useState } from "react";
import { Form, useNavigate } from "react-router";
import { setSession, hashPassword } from "~/utils/session";
import { ROLE_LIST } from "~/server/configs/role";

export default function Signup() {
  return (
    <section className="flex flex-col justify-center items-center h-screen gap-4">
      <h1>Signup</h1>

      <Form method="post" className="flex flex-col gap-4">
        <div>
          <label htmlFor="fullname" className="sr-only">
            Fullname
          </label>
          <input
            type="fullname"
            name="fullname"
            id="fullname"
            placeholder="Fullname"
            className="border py-2 px-4 rounded-xl border-slate-200"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="email"
            id="email"
            className="border py-2 px-4 rounded-xl border-slate-200"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            id="password"
            className="border py-2 px-4 rounded-xl border-slate-200"
            required
          />
        </div>
        <button type="submit">Signup</button>
      </Form>
    </section>
  );
}
