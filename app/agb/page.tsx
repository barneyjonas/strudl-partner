export default function AGBPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 16px 96px' }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.04em', marginBottom: 8 }}>
        Allgemeine Geschäftsbedingungen
      </h1>
      <p style={{ color: '#5f5f5f', fontSize: '0.9rem', marginBottom: 48 }}>
        Für die Nutzung der Strudl-Partnerplattform durch Unternehmen (B2B).<br />
        Es gilt österreichisches Recht (ABGB, UGB, ECG).
      </p>

      <Section title="1. Geltungsbereich und Vertragsparteien">
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen [NAME DES UNTERNEHMENS], [ADRESSE], Österreich (im Folgenden „Strudl") und Unternehmern im Sinne des § 1 UGB (im Folgenden „Partner"), die die Strudl-Plattform zur Verwaltung digitaler Kundenbindungsprogramme nutzen.
        </p>
        <p style={{ marginTop: 12 }}>
          Diese AGB gelten ausschließlich gegenüber Unternehmern. Vertragsabschlüsse mit Verbrauchern im Sinne des § 1 KSchG sind vom Anwendungsbereich dieser AGB ausgenommen.
        </p>
        <p style={{ marginTop: 12 }}>
          Abweichende AGB des Partners haben keine Geltung, es sei denn, Strudl stimmt ihrer Geltung ausdrücklich schriftlich zu.
        </p>
      </Section>

      <Section title="2. Leistungsbeschreibung">
        <p>Strudl stellt dem Partner folgende Leistungen zur Verfügung:</p>
        <ul style={{ paddingLeft: 20, marginTop: 12, lineHeight: 2 }}>
          <li>Digitales Stempelkartensystem für Endkunden (Gäste) via QR-Code-Scan</li>
          <li>Partner-Dashboard mit Echtzeitanalysen (Besuchsfrequenz, Kundensegmente, Prämieneinlösungen)</li>
          <li>Verwaltung von Kundenbindungsprogrammen und Prämien</li>
          <li>Technischer Support per E-Mail</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Strudl erbringt die Leistungen als Software-as-a-Service (SaaS). Ein Anspruch auf eine bestimmte Verfügbarkeit besteht, soweit nicht anderweitig schriftlich vereinbart, nicht. Strudl ist berechtigt, den Dienst für Wartungszwecke vorübergehend einzuschränken.
        </p>
      </Section>

      <Section title="3. Vertragsschluss und Registrierung">
        <p>
          Der Vertrag kommt durch Registrierung des Partners über das Online-Formular auf dieser Website und die anschließende Aktivierung des Partner-Accounts durch Strudl zustande (§ 9 ECG). Mit der Registrierung bestätigt der Partner, diese AGB gelesen und akzeptiert zu haben.
        </p>
        <p style={{ marginTop: 12 }}>
          Der Partner ist verpflichtet, bei der Registrierung wahrheitsgemäße und vollständige Angaben zu machen und diese aktuell zu halten. Strudl ist berechtigt, Registrierungen ohne Angabe von Gründen abzulehnen.
        </p>
      </Section>

      <Section title="4. Entgelt und Abrechnung">
        <p>
          Die Nutzung der Plattform ist in der Betaphase kostenlos. Strudl behält sich vor, nach Beendigung der Betaphase ein Entgelt einzuführen. Der Partner wird über Änderungen des Entgelts mit einer Frist von mindestens 30 Tagen per E-Mail informiert. Widerspricht der Partner der Änderung nicht innerhalb dieser Frist, gilt die Änderung als akzeptiert. Bei Widerspruch kann der Partner den Vertrag zum Datum des Wirksamwerdens der Änderung kündigen.
        </p>
      </Section>

      <Section title="5. Pflichten des Partners">
        <p>Der Partner verpflichtet sich:</p>
        <ul style={{ paddingLeft: 20, marginTop: 12, lineHeight: 2 }}>
          <li>Zugangsdaten geheim zu halten und unbefugten Dritten keinen Zugang zu verschaffen</li>
          <li>die Plattform nicht missbräuchlich oder rechtswidrig zu nutzen</li>
          <li>Strudl unverzüglich zu informieren, wenn Zugangsdaten unberechtigt genutzt wurden oder ein begründeter Verdacht darauf besteht</li>
          <li>gegenüber den eigenen Gästen eine ordnungsgemäße Datenschutzerklärung bereitzustellen und die erforderlichen Einwilligungen einzuholen, soweit der Partner als datenschutzrechtlich Verantwortlicher handelt</li>
          <li>keine Inhalte in die Plattform einzustellen, die Rechte Dritter verletzen oder gegen gesetzliche Vorschriften verstoßen</li>
        </ul>
      </Section>

      <Section title="6. Haftung">
        <p>
          Strudl haftet für Schäden aus der Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) sowie für Vorsatz und grobe Fahrlässigkeit nach den gesetzlichen Bestimmungen des ABGB. Die Haftung für leichte Fahrlässigkeit ist — soweit gesetzlich zulässig — ausgeschlossen.
        </p>
        <p style={{ marginTop: 12 }}>
          Strudl übernimmt keine Haftung für den wirtschaftlichen Erfolg des vom Partner betriebenen Kundenbindungsprogramms, für Datenverluste infolge höherer Gewalt oder für Ausfälle von Infrastrukturdienstleistern, die außerhalb des Einflussbereichs von Strudl liegen.
        </p>
        <p style={{ marginTop: 12 }}>
          Die Haftungsbeschränkungen gelten nicht bei Personenschäden sowie bei Schäden aus der Verletzung des Datenschutzrechts, für die DSGVO und DSG 2018 vorrangig gelten.
        </p>
      </Section>

      <Section title="7. Vertragsdauer und Kündigung">
        <p>
          Der Vertrag wird auf unbestimmte Zeit geschlossen. Beide Parteien können den Vertrag jederzeit mit einer Frist von 14 Tagen zum Monatsende kündigen. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
        </p>
        <p style={{ marginTop: 12 }}>
          Strudl ist berechtigt, den Vertrag mit sofortiger Wirkung zu kündigen, wenn der Partner gegen diese AGB oder geltendes Recht verstößt.
        </p>
        <p style={{ marginTop: 12 }}>
          Nach Beendigung des Vertrags stellt Strudl dem Partner auf Anfrage eine Exportdatei der gespeicherten Gästedaten im maschinenlesbaren Format (CSV oder JSON) zur Verfügung. Anschließend werden die Daten vollständig gelöscht.
        </p>
      </Section>

      <Section title="8. Änderungen der AGB">
        <p>
          Strudl ist berechtigt, diese AGB mit einer Ankündigungsfrist von 30 Tagen per E-Mail zu ändern. Widerspricht der Partner der Änderung nicht schriftlich innerhalb dieser Frist, gilt die Änderung als akzeptiert. Bei Widerspruch endet der Vertrag zum Zeitpunkt des Wirksamwerdens der geänderten AGB.
        </p>
      </Section>

      <Section title="9. Geistiges Eigentum">
        <p>
          Alle Rechte an der Plattform, ihrem Quellcode, ihren Designs und Marken verbleiben bei Strudl. Dem Partner wird ein nicht übertragbares, nicht exklusives Nutzungsrecht für die Dauer des Vertrags eingeräumt.
        </p>
      </Section>

      <Section title="10. Anwendbares Recht und Gerichtsstand">
        <p>
          Es gilt ausschließlich österreichisches Recht unter Ausschluss der Kollisionsnormen des internationalen Privatrechts und des UN-Kaufrechts (CISG).
        </p>
        <p style={{ marginTop: 12 }}>
          Für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist — vorbehaltlich zwingender gesetzlicher Zuständigkeitsbestimmungen — das sachlich zuständige Gericht in Wien ausschließlich zuständig.
        </p>
      </Section>

      <Section title="11. Schlussbestimmungen">
        <p>
          Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht. An die Stelle der unwirksamen Bestimmung tritt eine ihr wirtschaftlich möglichst nahestehende wirksame Regelung (§ 878 ABGB).
        </p>
        <p style={{ marginTop: 12 }}>
          Diese AGB sind in deutscher Sprache abgefasst. Im Fall von Widersprüchen zwischen einer deutschen und einer allfälligen fremdsprachigen Fassung ist die deutsche Fassung maßgeblich.
        </p>
      </Section>

      <p style={{ marginTop: 56, color: '#9f9f9f', fontSize: '0.82rem' }}>
        Stand: Juni 2026 | Strudl, Österreich
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 14, letterSpacing: '-0.01em' }}>{title}</h2>
      <div style={{ lineHeight: 1.75, color: '#3f3f3f', fontSize: '0.97rem' }}>{children}</div>
    </section>
  )
}
