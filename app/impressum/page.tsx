export default function ImpressumPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 16px 96px' }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.04em', marginBottom: 8 }}>
        Impressum
      </h1>
      <p style={{ color: '#5f5f5f', fontSize: '0.9rem', marginBottom: 48 }}>
        Angaben gemäß § 5 E-Commerce-Gesetz (ECG), BGBl. I Nr. 152/2001 idgF
      </p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Diensteanbieter</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f3f' }}>
          [NAME DES UNTERNEHMENS / VOLLSTÄNDIGER NAME]<br />
          [STRASSE UND HAUSNUMMER]<br />
          [PLZ ORT], Österreich
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Kontakt</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f3f' }}>
          E-Mail: <a href="mailto:[KONTAKT-EMAIL]" style={{ color: '#0f0f0f' }}>[KONTAKT-EMAIL]</a>
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Unternehmensgegenstand</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f3f' }}>
          Betrieb einer digitalen Kundenbindungsplattform für Kaffeehäuser und Gastronomiebetriebe.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Unternehmensregister</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f3f' }}>
          [FIRMENBUCHNUMMER, sofern eingetragen, z.B.: FN XXXXXX x, Handelsgericht Wien]<br />
          UID-Nummer: [ATU-NUMMER, sofern vorhanden]
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Aufsichtsbehörde / Gewerbebehörde</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f3f' }}>
          Bezirkshauptmannschaft / Magistrat [ORT]<br />
          Anwendbare Vorschrift: Gewerbeordnung 1994 (GewO 1994), BGBl. Nr. 194/1994 idgF
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Mitgliedschaft bei Interessenvertretungen</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f5f' }}>
          [Wirtschaftskammer Österreich (WKO), Fachgruppe Unternehmensberatung, Buchhaltung und Informationstechnologie (UBIT) — sofern zutreffend]
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Urheberrecht</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f3f' }}>
          Die Inhalte dieser Website sind urheberrechtlich geschützt. Eine Vervielfältigung, Verbreitung oder sonstige Nutzung bedarf der vorherigen schriftlichen Zustimmung des Diensteanbieters, sofern nicht gesetzlich ausdrücklich gestattet.
        </p>
      </section>

      <section>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Haftungsausschluss für externe Links</h2>
        <p style={{ lineHeight: 1.8, color: '#3f3f3f' }}>
          Diese Website kann Links zu externen Websites enthalten. Für die Inhalte externer Websites übernimmt der Diensteanbieter keine Haftung. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden derartige Links unverzüglich entfernt.
        </p>
      </section>

      <p style={{ marginTop: 56, color: '#9f9f9f', fontSize: '0.82rem' }}>
        Stand: Juni 2026
      </p>
    </div>
  )
}
