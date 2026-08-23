import { SiteHeader } from "../../components/SiteHeader"; 
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "Privacy Policy | Cash For Bikes UK",
  description: "How Cash For Bikes collects and uses your personal data when you request a motorbike quote.",
};

export default function PrivacyPage() {
    return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      <SiteHeader />
    <main className="mx-auto max-w-3xl px-4 py-16 text-neutral-200">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-sm text-neutral-400">Last updated: {new Date().getFullYear()}</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 text-xl font-semibold">Who we are</h2>
          <p>Cash For Bikes buys motorbikes across the UK. Contact: Urbanmoto18@gmail.com</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">What we collect</h2>
          <p>When you request a quote we collect your name, email address, phone number, postcode, vehicle registration, mileage, condition, any notes and photos you choose to upload. We do not collect payment details or identity documents through this website.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">Why we use it</h2>
          <p>Solely to prepare your valuation and contact you about buying your motorbike. Our lawful basis is legitimate interest / steps taken at your request prior to entering a contract. We do not sell or share your data with third parties for marketing.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">How it is stored</h2>
          <p>Quote requests are sent to us by email through our email provider (Resend). We do not store your details in any website database. We keep quote emails for up to 12 months and then delete them.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">Vehicle data</h2>
          <p>Registration numbers you enter are sent to the DVLA Vehicle Enquiry Service to retrieve publicly available vehicle information.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">Cookies and analytics</h2>
          <p>We use Google Analytics to understand how the site is used. Analytics cookies are only set if you press &ldquo;Accept&rdquo; on our cookie banner. You can change your choice at any time by clearing your browser storage for this site.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">Your rights</h2>
          <p>Under UK GDPR you can ask for a copy of your data, correction, deletion, or object to its use. Email Urbanmoto18@gmail.com and we will respond within one month. You can also complain to the Information Commissioner&apos;s Office (ico.org.uk).</p>
        </section>
      </div>
    </main>
      <SiteFooter />
    </div>
  );
}
