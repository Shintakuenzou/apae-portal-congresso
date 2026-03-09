import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import LogoApae from "../../public/logo-transparente.png";
import { Link } from "@tanstack/react-router";
import { useEvents } from "@/hooks/useEvents";
import { formatThreeDayRangeSimple } from "@/utils/formatThreeDayRange";

const socialLinks = [
  { icon: "facebook", href: "https://www.facebook.com/apaebrasil/", label: "Facebook" },
  { icon: "instagram", href: "https://www.instagram.com/Apaebrasil/", label: "Instagram" },
  { icon: "youtube", href: "https://www.youtube.com/@ApaeBrasilOficial", label: "YouTube" },
  { icon: "linkedin", href: "https://www.linkedin.com/company/apaebrasil/posts/?feedView=all", label: "LinkedIn" },
];

/* ─── Card wrapper padronizado ───────────────────────────────────── */
function FooterCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-background/5 border border-background/10 rounded-2xl p-6 flex flex-col gap-5 ${className}`}>{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 text-center">{children}</p>;
}

/* ─── Footer ─────────────────────────────────────────────────────── */
export function Footer() {
  const { formatedDataEvento } = useEvents();

  return (
    <footer className="bg-violet-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {/* ── Grade principal ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 – Identidade */}
          <FooterCard className="lg:col-span-1 justify-between">
            {/* Logo + nome */}
            <div className="flex items-center gap-3 justify-center">
              <img src={LogoApae} className="w-12 h-12 object-cover rounded-full ring-2 ring-background/20 p-0.5 bg-background/10 flex-shrink-0" alt="Logo APAE" />
            </div>

            {/* Tagline */}
            <p className="text-sm text-background/65 leading-relaxed text-justify flex">
              O maior evento de inclusão social do Brasil. Transformando vidas por meio da educação, da saúde e da cidadania.
            </p>

            {/* Redes sociais */}
            <div className="flex justify-center flex-col items-center">
              <SectionLabel>Redes Sociais</SectionLabel>
              <div className="flex gap-2 mt-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    to={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-violet-950 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <DynamicIcon name={social.icon as IconName} className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </FooterCard>

          {/* Card 2 – Contato */}
          <FooterCard>
            <SectionLabel>Contato</SectionLabel>

            <ul className="flex flex-col gap-4">
              {/* E-mail */}
              <li>
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-white/50 uppercase tracking-wide font-medium">E-mail</span>
                </div>
                <a
                  href="mailto:fenapaes@apaebrasil.org.br"
                  className="text-sm hover:text-amber-400 transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-amber-400 pl-6"
                >
                  fenapaes@apaebrasil.org.br
                </a>
              </li>

              {/* Telefone */}
              <li className="border-t border-background/10 pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Telefone</span>
                </div>
                <a href="tel:+556132249922" className="text-sm hover:text-amber-400 transition-colors pl-6">
                  (61) 3224-9922
                </a>
              </li>

              {/* Endereço */}
              {/* <li className="border-t border-background/10 pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-xs text-background/50 uppercase tracking-wide font-medium">Endereço</span>
                </div>
                <address className="not-italic text-sm text-background/75 leading-relaxed pl-6">
                  SDS Venâncio IV — Cobertura
                  <br />
                  CEP: 70393-903
                  <br />
                  Brasília — Distrito Federal
                </address>
              </li> */}
            </ul>
          </FooterCard>

          {/* Card 3 – Local do Evento */}
          <FooterCard>
            <SectionLabel>Local do Evento</SectionLabel>

            {formatedDataEvento?.length ? (
              <div className="flex flex-col gap-4">
                {formatedDataEvento.map((item, index) => (
                  <div key={index} className="bg-background/5 border border-background/10 rounded-xl p-4 flex flex-col gap-3">
                    {/* Nome do local */}
                    <p className="font-semibold text-sm leading-snug">{item.fields.local_evento}</p>

                    {/* Cidade/Estado */}
                    <div className="flex items-center gap-1.5 text-background/60 text-xs">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {item.fields.cidade} — {item.fields.estado}
                      </span>
                    </div>

                    {/* Data */}
                    <div className="border-t border-background/10 pt-3">
                      <p className="text-xs text-background/50 mb-0.5 uppercase tracking-wide font-medium">Data</p>
                      <p className="text-sm font-semibold text-amber-400">{formatThreeDayRangeSimple(item.fields.data_inicio, item.fields.data_fim)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-background/40 italic">Nenhum evento cadastrado.</p>
            )}
          </FooterCard>
        </div>

        {/* ── Rodapé inferior ── */}
        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200">
          <p>© {new Date().getFullYear()} Federação Nacional das APAEs. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido pela Equipe de TI da Apae Brasil
            <ExternalLink className="h-3 w-3 opacity-60" />
          </p>
        </div>
      </div>
    </footer>
  );
}
