export default function DatenschutzPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 16px 96px' }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.04em', marginBottom: 8 }}>
        Datenschutzerklärung
      </h1>
      <p style={{ color: '#5f5f5f', fontSize: '0.9rem', marginBottom: 48 }}>
        Gemäß Art. 13 und 14 DSGVO (Verordnung (EU) 2016/679) sowie § 165 TKG 2021 (BGBl. I Nr. 190/2021)
      </p>

      <Section title="1. Verantwortlicher">
        <p>
          [NAME DES UNTERNEHMENS / VOLLSTÄNDIGER NAME]<br />
          [ADRESSE], Österreich<br />
          E-Mail: <a href="mailto:[KONTAKT-EMAIL]" style={{ color: '#0f0f0f' }}>[KONTAKT-EMAIL]</a>
        </p>
        <p style={{ marginTop: 12 }}>
          Zuständige Datenschutzaufsichtsbehörde in Österreich:<br />
          <strong>Österreichische Datenschutzbehörde (DSB)</strong><br />
          Barichgasse 40–42, 1030 Wien<br />
          <a href="https://www.dsb.gv.at" style={{ color: '#0f0f0f' }}>www.dsb.gv.at</a> | dsb@dsb.gv.at
        </p>
      </Section>

      <Section title="2. Grundsätze der Verarbeitung">
        <p>
          Wir verarbeiten personenbezogene Daten nur, soweit dies zur Erfüllung eines Vertrages, zur Erfüllung gesetzlicher Verpflichtungen, auf Grundlage einer Einwilligung oder auf Grundlage berechtigter Interessen gemäß Art. 6 DSGVO erforderlich ist. Eine Verarbeitung zu anderen als den angegebenen Zwecken findet nicht statt.
        </p>
      </Section>

      <Section title="3. Verarbeitete Datenkategorien und Zwecke">
        <SubSection title="3.1 Partnerregistrierung (Kaffeehäuser)">
          <p>
            <strong>Daten:</strong> Name des Betriebs, E-Mail-Adresse, Partner-Code.<br />
            <strong>Zweck:</strong> Abschluss und Durchführung des Partnervertrags.<br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).<br />
            <strong>Speicherdauer:</strong> Für die Dauer der Geschäftsbeziehung sowie die gesetzliche Aufbewahrungsfrist (7 Jahre gemäß § 132 BAO).
          </p>
        </SubSection>

        <SubSection title="3.2 Dashboard-Nutzung">
          <p>
            <strong>Daten:</strong> Anmeldedaten (E-Mail, gehashtes Passwort), Nutzungsprotokoll.<br />
            <strong>Zweck:</strong> Authentifizierung und Bereitstellung des Partner-Dashboards.<br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).<br />
            <strong>Speicherdauer:</strong> Bis zur Löschung des Partnerkontos, danach unverzügliche Löschung.
          </p>
        </SubSection>

        <SubSection title="3.3 Gästedaten (Stempel- und Bonusdaten)">
          <p>
            <strong>Daten:</strong> Pseudonymisierte Nutzer-ID, Zeitstempel der Besuche, eingelöste Prämien.<br />
            <strong>Zweck:</strong> Betrieb des Kundenbindungsprogramms im Auftrag des Kaffeehauses.<br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO auf Seiten des Gastes (Vertragserfüllung mit dem Kaffeehaus); Strudl handelt als Auftragsverarbeiter gemäß Art. 28 DSGVO.<br />
            <strong>Speicherdauer:</strong> Gemäß Auftragsverarbeitungsvertrag (AVV) mit dem jeweiligen Kaffeehaus.
          </p>
        </SubSection>

        <SubSection title="3.4 Kontaktanfragen">
          <p>
            <strong>Daten:</strong> Name, E-Mail-Adresse, Nachrichteninhalt.<br />
            <strong>Zweck:</strong> Bearbeitung Ihrer Anfrage.<br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).<br />
            <strong>Speicherdauer:</strong> 3 Monate nach Abschluss der Korrespondenz, sofern keine längere gesetzliche Pflicht besteht.
          </p>
        </SubSection>
      </Section>

      <Section title="4. Technische Speicherung und Cookies">
        <p>
          Gemäß § 165 Abs. 3 TKG 2021 ist das Speichern von Informationen auf Endgeräten oder der Zugriff auf dort gespeicherte Informationen nur mit ausdrücklicher Einwilligung der Nutzerin oder des Nutzers zulässig, es sei denn, die Speicherung ist für die ausdrücklich gewünschte Nutzung des Dienstes technisch unbedingt erforderlich.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>Technisch notwendige Speicherung:</strong> Zur Authentifizierung im Partner-Dashboard verwenden wir eine Session-basierte Speicherung im Browser (sessionStorage). Diese ist technisch für die Nutzung des Dashboards erforderlich und erfordert keine gesonderte Einwilligung.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>Analytische oder Marketing-Cookies:</strong> Wir setzen derzeit keine analytischen oder Marketing-Cookies ein.
        </p>
      </Section>

      <Section title="5. Auftragsverarbeiter und Empfänger">
        <p>
          Wir setzen folgende technische Dienstleister als Auftragsverarbeiter gemäß Art. 28 DSGVO ein:
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <strong>Supabase Inc.</strong> (Datenbankinfrastruktur) — Datenhaltung auf Servern innerhalb der EU/des EWR (AWS eu-central-1, Frankfurt). Es erfolgt keine Übermittlung in Drittländer.
          </li>
          <li>
            <strong>GitHub, Inc.</strong> (Hosting dieser Website via GitHub Pages) — Servicesitz: USA. Die Übermittlung erfolgt auf Grundlage der Standardvertragsklauseln der EU (Art. 46 Abs. 2 lit. c DSGVO) sowie des EU–US Data Privacy Framework.
          </li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Eine Weitergabe an Dritte zu Werbezwecken findet nicht statt.
        </p>
      </Section>

      <Section title="6. Ihre Rechte als betroffene Person">
        <p>
          Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
          <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
          <li><strong>Recht auf Löschung</strong> („Recht auf Vergessenwerden", Art. 17 DSGVO)</li>
          <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
          <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
          <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) — insbesondere gegen Verarbeitungen auf Grundlage berechtigter Interessen</li>
          <li><strong>Recht auf Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3 DSGVO) — ohne Auswirkung auf die Rechtmäßigkeit der bisherigen Verarbeitung</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Zur Ausübung Ihrer Rechte wenden Sie sich an: <a href="mailto:[KONTAKT-EMAIL]" style={{ color: '#0f0f0f' }}>[KONTAKT-EMAIL]</a>
        </p>
      </Section>

      <Section title="7. Beschwerderecht bei der Datenschutzbehörde">
        <p>
          Unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe steht Ihnen das Recht zu, bei der österreichischen Datenschutzbehörde Beschwerde einzulegen, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO oder das österreichische DSG 2018 verstößt:
        </p>
        <p style={{ marginTop: 12 }}>
          Österreichische Datenschutzbehörde<br />
          Barichgasse 40–42, 1030 Wien<br />
          Telefon: +43 1 52 152-0<br />
          E-Mail: dsb@dsb.gv.at<br />
          <a href="https://www.dsb.gv.at" style={{ color: '#0f0f0f' }}>www.dsb.gv.at</a>
        </p>
      </Section>

      <Section title="8. Aktualität dieser Datenschutzerklärung">
        <p>
          Diese Datenschutzerklärung kann bei Änderungen unserer Leistungen oder der Rechtslage angepasst werden. Es gilt jeweils die auf dieser Seite veröffentlichte aktuelle Fassung.
        </p>
      </Section>

      <p style={{ marginTop: 56, color: '#9f9f9f', fontSize: '0.82rem' }}>
        Stand: Juni 2026
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontWeight: 600, fontSize: '0.97rem', marginBottom: 8, color: '#0f0f0f' }}>{title}</h3>
      <div style={{ lineHeight: 1.75, color: '#3f3f3f', fontSize: '0.94rem' }}>{children}</div>
    </div>
  )
}
