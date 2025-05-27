import { Form } from "react-router";

export default function EditCategory() {
  return (
    <Form>
      <label htmlFor="edit-category">Edit Category</label>
      <input type="text" name="edit-category" id="edit-category" />
    </Form>
  );
}
