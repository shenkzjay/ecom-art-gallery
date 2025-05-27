import { Form, NavLink } from "react-router";
import { Modals } from "~/components/modals";
import { useRef } from "react";
import { ROLE_LIST } from "~/server/configs/role";

export default function Artist() {
  const createArtistRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = () => {
    createArtistRef.current?.close();
  };

  const handleOpenCreateArtistModal = () => {
    createArtistRef.current?.showModal();
  };

  return (
    <main>
      <section>
        <button type="button" onClick={handleOpenCreateArtistModal}>
          Sign up as an artist
        </button>
      </section>

      <section>
        <div>
          <h3>Artworks by our esteemed artistes</h3>
        </div>

        <section>
          <article>
            <figure>
              <span>Images goes here</span>
              <figcaption></figcaption>
            </figure>
          </article>
        </section>
      </section>

      <Modals ref={createArtistRef} handleCloseModal={handleCloseModal}>
        <section className="p-6">
          <Form method="post" className="gap-4 grid">
            <div>
              <label htmlFor="username" className="sr-only">
                Fullname
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="border py-2 px-4 rounded-xl"
                placeholder="username"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border py-2 px-4 rounded-xl"
                placeholder="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="border py-2 px-4 rounded-xl"
                placeholder="Statement"
              />
            </div>

            <div>
              <label htmlFor="bio" className="sr-only">
                Statement
              </label>
              <input
                type="hidden"
                name="role"
                id="role"
                className="border py-2 px-4 rounded-xl"
                value={ROLE_LIST.artist}
              />
            </div>

            <button type="submit">Create Artist</button>
          </Form>
        </section>
      </Modals>
    </main>
  );
}
