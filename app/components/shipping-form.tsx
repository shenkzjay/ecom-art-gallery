interface ShippingFormProps {
  fullname: string;
  street: string;
  state: string;
  zip: string;
  country: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  fullname,
  street,
  state,
  zip,
  country,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="fullname" className="sr-only"></label>
        <input
          type="text"
          name="fullname"
          id="fullname"
          className="border border-slate-300 py-2 px-4 rounded-xl w-full"
          placeholder="Full Name"
          value={fullname}
          required
          onChange={onChange}
        />
      </div>

      <div>
        <label htmlFor="street" className="sr-only"></label>
        <input
          type="text"
          name="street"
          id="street"
          className="border border-slate-300 py-2 px-4 rounded-xl w-full"
          placeholder="Street"
          value={street}
          required
          onChange={onChange}
        />
      </div>

      <div>
        <label htmlFor="state" className="sr-only"></label>
        <input
          type="text"
          name="state"
          id="state"
          className="border border-slate-300 py-2 px-4 rounded-xl w-full"
          placeholder="State"
          value={state}
          required
          onChange={onChange}
        />
      </div>

      <div>
        <label htmlFor="zip" className="sr-only"></label>
        <input
          type="text"
          name="zip"
          id="zip"
          className="border border-slate-300 py-2 px-4 rounded-xl w-full"
          placeholder="ZIP"
          value={zip}
          required
          onChange={onChange}
        />
      </div>

      <div>
        <label htmlFor="country" className="sr-only"></label>
        <input
          type="text"
          name="country"
          id="country"
          className="border border-slate-300 py-2 px-4 rounded-xl w-full"
          placeholder="Country"
          value={country}
          required
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ShippingForm;
