# Learning Log

One entry per code change, newest at the bottom. Each entry explains what changed, why, the concepts behind it, what to double-check, and a quiz question.

---

## 2026-10-27 — Clear the "Please fix the highlighted fields" banner once the form is fixed

### What changed
- **File:** `frontend/src/admin/ProjectFormPage.jsx`
- **Function:** `update`, the small helper that runs every time you type in the Add/Edit Project form.
- Before, when you clicked **Save** with mistakes, two things appeared: red messages under each bad field, and a red banner at the bottom saying *"Please fix the highlighted fields."* As you corrected the fields, the red field messages went away, **but the banner stayed**. Now the banner also disappears as soon as every field is valid.

```jsx
setValues((current) => {
  const next = { ...current, ...patch };
  if (Object.keys(errors).length) {          // were there errors before?
    const found = validate(next);            // re-check with the new values
    setErrors(found);                        // update the red field messages
    if (!Object.keys(found).length) setFormError(''); // no errors left → hide banner
  }
  return next;
});
```

### Why
A banner saying "fix the fields" when nothing is wrong any more is confusing, and you might think saving is still blocked. The form should only show errors that are still true.

### New concepts and syntax

**1. State in React (`useState`)**
React components remember values in *state*. `useState` gives you the value and a function to change it:
```jsx
const [count, setCount] = useState(0);
setCount(5); // React re-draws the component with count = 5
```
This form uses three pieces of state here: `values` (what you typed), `errors` (messages per field) and `formError` (the banner text).

**2. Functional updates: `setValues((current) => ...)`**
Instead of passing the new value directly, you can pass a **function**. React calls it with the latest value:
```jsx
setCount((current) => current + 1); // always uses the newest count
```
This matters when updates happen quickly or after waiting, for example when an image upload finishes after you have typed more text.

**3. Spread syntax `{ ...current, ...patch }`**
`...` copies all the properties of an object into a new object. Later properties overwrite earlier ones:
```js
const current = { title: 'Old', category: 'React' };
const patch = { title: 'New' };
const next = { ...current, ...patch }; // { title: 'New', category: 'React' }
```
We create a **new** object instead of changing the old one, because React only notices a change when it gets a new object.

**4. `Object.keys(obj).length` — "is this object empty?"**
`Object.keys` returns an array of an object's property names. Its `.length` tells you how many there are:
```js
Object.keys({ title: 'Required' }).length; // 1 → there is an error
Object.keys({}).length;                    // 0 → no errors
```
`!0` is `true` and `!1` is `false`, so `!Object.keys(found).length` means "found is empty".

**5. Short `if` without braces**
```js
if (!Object.keys(found).length) setFormError('');
```
is the same as
```js
if (Object.keys(found).length === 0) {
  setFormError('');
}
```
The one-line form only works for a single statement.

### Risky / worth double-checking
- This code calls `setErrors` and `setFormError` *inside* the `setValues` updater function. That works, but React prefers updater functions to only calculate a new value. In development, React's StrictMode may run updaters twice. That is harmless here, because running `validate` twice gives the same result, but don't put things like API calls inside an updater.
- The re-check only runs **after** the first failed save (`if (Object.keys(errors).length)`). That is on purpose: we don't want red errors while someone is still typing their first draft.
- Try it: open **Add Project**, click **Save & publish** with an empty form, then fill in the title and description. The banner should disappear once both are valid.

### Quiz
Why do we write `{ ...current, ...patch }` and return a **new** object, instead of just doing `current.title = 'New'; return current;`?

<details><summary>Answer</summary>

React decides whether to re-draw by checking whether the state is a *different object*. If you change the old object and return it, React sees the same object and may not update the screen. Creating a new object with spread makes the change visible to React.

</details>
