import { clearAuthCookies, getAuthCookie, isTokenExpired } from "@/lib/cookie";
import { fetchDataset } from "@/services/fetch-dataset";
import type { TokenProps } from "@/types/token";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  // beforeLoad: async ({}) => {
  //   const token = getAuthCookie("token");
  //   const exp = getAuthCookie("tokenExp");

  //   if (!token) {
  //     throw redirect({ to: "/login", search: { redirect: location.href } });
  //   }

  //   if (exp && isTokenExpired(exp)) {
  //     clearAuthCookies();
  //     throw redirect({ to: "/login", search: { redirect: location.href } });
  //   }

  //   const user = await fetchDataset<TokenProps>({
  //     datasetId: import.meta.env.VITE_DATASET_DS_VALIDATE_TOKEN as string,
  //     constraints: [
  //       {
  //         fieldName: "token",
  //         initialValue: token,
  //         finalValue: token,
  //         constraintType: "MUST",
  //       },
  //     ],
  //   });

  //   if (user.items[0].status !== "SUCCESS") {
  //     clearAuthCookies();
  //     throw redirect({ to: "/login", search: { redirect: location.href } });
  //   }
  // },
});
