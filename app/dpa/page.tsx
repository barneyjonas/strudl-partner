export default function DPAPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 16px 96px' }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.04em', marginBottom: 8 }}>
        Auftragsverarbeitungsvertrag
      </h1>
      <p style={{ color: '#5f5f5f', fontSize: '0.9rem', marginBottom: 8 }}>
        Gemäß Art. 28 DSGVO (Verordnung (EU) 2016/679)
      </p>
      <p style={{ color: '#5f5f5f', fontSize: '0.9rem', marginBottom: 48 }}>
        Dieser Vertrag ist Bestandteil des Partnervertrags zwischen dem Kaffeehaus (Auftraggeber / Verantwortlicher) und Strudl (Auftragnehmer / Auftragsverarbeiter).
      </p>

      <Section title="Präambel">
        <p>
          Der Auftraggeber betreibt ein Kaffeehaus oder einen Gastronomiebetrieb in Österreich. Der Auftragnehmer stellt dem Auftraggeber eine digitale Kundenbindungsplattform (Strudl) zur Verfügung, im Zuge derer personenbezogene Daten der Gäste des Auftraggebers verarbeitet werden. Hinsichtlich dieser Verarbeitung ist der Auftraggeber datenschutzrechtlich Verantwortlicher (Art. 4 Nr. 7 DSGVO), der Auftragnehmer Auftragsverarbeiter (Art. 4 Nr. 8 DSGVO).
        </p>
        <p style={{ marginTop: 12 }}>
          Die Parteien schließen diesen Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 Abs. 3 DSGVO ab.
        </p>
      </Section>

      <Section title="1. Gegenstand, Art und Zweck der Verarbeitung">
        <p>
          <strong>Gegenstand:</strong> Betrieb einer digitalen Stempelkarten- und Kundenbindungsplattform.
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>Art der Verarbeitung:</strong> Erhebung, Speicherung, Abfrage, Verwendung, Übermittlung und Löschung personenbezogener Daten der Gäste des Auftraggebers.
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>Zweck:</strong> Durchführung eines digitalen Kundenbindungsprogramms (Stempel, Prämien, Gästeanalysen) im Auftrag des Auftraggebers.
        </p>
      </Section>

      <Section title="2. Art der verarbeiteten Daten und betroffene Personen">
        <p><strong>Datenkategorien:</strong></p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>Pseudonymisierte Nutzer-ID (keine direkte Zuordnung zu Name ohne Schlüssel des Auftraggebers)</li>
          <li>Zeitstempel von Besuchen (Stempelzeitpunkte)</li>
          <li>Eingelöste und ausstehende Prämien</li>
          <li>Besuchshäufigkeit und -muster (aggregiert und auf Einzelnutzerebene)</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          <strong>Betroffene Personen:</strong> Gäste des Auftraggebers, die die Strudl-App nutzen.
        </p>
      </Section>

      <Section title="3. Pflichten des Auftragsverarbeiters (Strudl)">
        <p>Der Auftragnehmer verpflichtet sich:</p>
        <ol style={{ paddingLeft: 20, marginTop: 12, lineHeight: 2.2 }}>
          <li>
            Personenbezogene Daten ausschließlich auf dokumentierte Weisung des Auftraggebers zu verarbeiten (Art. 28 Abs. 3 lit. a DSGVO). Als dokumentierte Weisung gilt der Inhalt dieses AVV sowie der Partnervertrag.
          </li>
          <li>
            Sicherzustellen, dass sich die zur Verarbeitung der Daten befugten Personen zur Vertraulichkeit verpflichtet haben oder einer angemessenen gesetzlichen Verschwiegenheitspflicht unterliegen (Art. 28 Abs. 3 lit. b DSGVO).
          </li>
          <li>
            Alle erforderlichen technischen und organisatorischen Maßnahmen gemäß Art. 32 DSGVO zu ergreifen, insbesondere Verschlüsselung gespeicherter Daten, Zugangskontrolle, Protokollierung und regelmäßige Überprüfung der Sicherheitsmaßnahmen.
          </li>
          <li>
            Den Auftraggeber bei der Erfüllung von Betroffenenrechten (Art. 15–22 DSGVO) zu unterstützen, soweit die verarbeiteten Daten betroffen sind (Art. 28 Abs. 3 lit. e DSGVO).
          </li>
          <li>
            Den Auftraggeber unverzüglich zu informieren, wenn dem Auftragnehmer eine Weisung des Auftraggebers als Verstoß gegen die DSGVO oder andere Datenschutzvorschriften erscheint (Art. 28 Abs. 3 Satz 2 DSGVO).
          </li>
          <li>
            Dem Auftraggeber alle erforderlichen Informationen zur Verfügung zu stellen, um die Einhaltung der in Art. 28 DSGVO niedergelegten Pflichten nachweisen zu können, und Überprüfungen — einschließlich Inspektionen — zu ermöglichen (Art. 28 Abs. 3 lit. h DSGVO).
          </li>
          <li>
            Im Fall einer Verletzung des Schutzes personenbezogener Daten (Art. 4 Nr. 12 DSGVO) den Auftraggeber unverzüglich, spätestens innerhalb von 24 Stunden nach Bekanntwerden, zu benachrichtigen (Art. 33 Abs. 2 DSGVO).
          </li>
          <li>
            Nach Beendigung des Vertrags alle personenbezogenen Daten des Auftraggebers auf Wahl des Auftraggebers zu löschen oder zurückzugeben und bestehende Kopien zu vernichten, sofern nicht eine gesetzliche Verpflichtung zur weiteren Speicherung besteht (Art. 28 Abs. 3 lit. g DSGVO).
          </li>
        </ol>
      </Section>

      <Section title="4. Unterauftragsverarbeiter">
        <p>
          Der Auftraggeber erteilt dem Auftragnehmer eine allgemeine Genehmigung zur Hinzuziehung der nachfolgend genannten Unterauftragsverarbeiter (Art. 28 Abs. 2 DSGVO):
        </p>
        <div style={{ marginTop: 16, border: '1px solid #dadada', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f6f6f6' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #dadada' }}>Anbieter</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #dadada' }}>Sitz</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #dadada' }}>Zweck</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #dadada' }}>Übermittlung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', color: '#3f3f3f' }}>Supabase Inc.</td>
                <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', color: '#3f3f3f' }}>USA</td>
                <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', color: '#3f3f3f' }}>Datenbankinfrastruktur</td>
                <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', color: '#3f3f3f' }}>EU (Frankfurt, AWS)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 12 }}>
          Der Auftragnehmer verpflichtet Unterauftragsverarbeiter vertraglich zu gleichwertigen Datenschutzpflichten gemäß Art. 28 Abs. 4 DSGVO. Der Auftraggeber wird über geplante Änderungen der Unterauftragsverarbeiter mindestens 14 Tage im Voraus per E-Mail informiert und kann in diesem Fall den Partnervertrag außerordentlich kündigen.
        </p>
      </Section>

      <Section title="5. Weisungsrecht des Auftraggebers">
        <p>
          Der Auftraggeber kann dem Auftragnehmer jederzeit Weisungen zur Verarbeitung personenbezogener Daten erteilen. Weisungen erfolgen schriftlich (E-Mail genügt). Der Auftragnehmer setzt Weisungen unverzüglich um, sofern sie nicht gegen die DSGVO oder österreichisches Datenschutzrecht verstoßen.
        </p>
      </Section>

      <Section title="6. Laufzeit">
        <p>
          Dieser AVV ist auf die Dauer des Partnervertrags befristet und endet automatisch mit dessen Beendigung. Die Pflichten des Auftragsverarbeiters zur Löschung oder Rückgabe der Daten (Ziffer 3.8) gelten über das Vertragsende hinaus.
        </p>
      </Section>

      <Section title="7. Anwendbares Recht">
        <p>
          Für diesen AVV gilt österreichisches Recht. Gerichtsstand ist Wien.
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
