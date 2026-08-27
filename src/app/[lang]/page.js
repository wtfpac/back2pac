import { getDictionary } from '@/dictionaries';
import Section from '@/components/Section';

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <div className="hero">
        <h1 className="hero-name">Wellington Alves</h1>
        <p className="hero-tagline">{dict.hero.role} · {dict.hero.location}</p>
        <span className="hero-status">{dict.hero.available}</span>
      </div>

      <Section id="about" title={dict.sections.about}>
        <p>{dict.about.text}</p>
      </Section>

      <Section id="contact" title={dict.sections.contact}>
        <ul className="plain-list">
          <li>
            {dict.contact.emailLabel}:{' '}
            <a href={`mailto:${dict.contact.email}`}>{dict.contact.email}</a>
          </li>
          <li>
            LinkedIn:{' '}
            <a href={dict.contact.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/w7ll
            </a>
          </li>
          <li>
            GitHub:{' '}
            <a href={dict.contact.github} target="_blank" rel="noopener noreferrer">
              github.com/wtfpac
            </a>
          </li>
        </ul>
      </Section>

      <Section id="experience" title={dict.sections.experience}>
        {dict.experience.items.map((job) => (
          // empresa + periodo como chave: dois cargos iguais em empresas
          // diferentes nao colidem
          <article key={`${job.company}-${job.period}`} className="entry">
            <div className="entry-head">
              <span>{job.role} — <span className="entry-org">{job.company}</span></span>
              <span className="entry-date">{job.period}</span>
            </div>
            <p className="entry-note">{job.summary}</p>
          </article>
        ))}
      </Section>

      <Section id="projects" title={dict.sections.projects}>
        {dict.projects.items.map((project) => (
          <article key={project.name} className="entry">
            <div className="entry-head">
              <span>{project.name}</span>
            </div>
            <p className="entry-note">{project.summary}</p>
            <div className="tag-list">
              {project.tech.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </article>
        ))}
      </Section>

      <Section id="skills" title={dict.sections.skills}>
        {dict.skills.groups.map((group) => (
          <div key={group.category} className="skill-row">
            <span className="skill-category">{group.category}</span>
            <span className="tag-list">
              {group.items.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </span>
          </div>
        ))}
      </Section>

      <Section id="certifications" title={dict.sections.certifications}>
        <ul className="plain-list">
          {dict.certifications.items.map((cert) => (
            <li key={cert.name}>
              {cert.name} — {cert.issuer}{' '}
              <span className="entry-date">({cert.date})</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="education" title={dict.sections.education}>
        {dict.education.items.map((item) => (
          <article key={item.course} className="entry">
            <div className="entry-head">
              <span>{item.course} — <span className="entry-org">{item.school}</span></span>
              <span className="entry-date">{item.period}</span>
            </div>
            <p className="entry-note">{item.status}</p>
          </article>
        ))}
      </Section>

      <Section id="languages" title={dict.sections.languages}>
        <div className="tag-list">
          {dict.languages.items.map((item) => (
            <span key={item.name} className="tag">{item.name} — {item.level}</span>
          ))}
        </div>
      </Section>

      <Section id="links" title={dict.sections.links}>
        <ul className="inline-list">
          {dict.links.items.map((link) => (
            <li key={link.label}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}