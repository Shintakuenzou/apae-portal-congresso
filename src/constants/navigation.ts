/**
 * @module constants/navigation
 * @description Itens de navegação principal do site, usados no header e menu mobile.
 */
import { linkOptions } from "@tanstack/react-router";

/** Links de navegação principal do site. */
export const NAV_ITEMS = linkOptions([
  {
    to: "/quem-somos",
    label: "Quem Somos",
  },
  {
    to: "/palestrantes",
    label: "Palestrantes",
  },
  {
    to: "/palestras",
    label: "Programação",
  },
  {
    to: "/comissao-cientifica",
    label: "Comissão Científica",
  },
  {
    to: "/galeria",
    label: "Galeria",
  },
]);
