import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import ListRoles from "pages/roles";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";

setupApiHandlers();

describe("pages/roles", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should list roles", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
    }));
    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );

    expect(
      await screen.findByRole("row", {
        name: "Role Sort By Role Filter Role By Search Action",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("row", { name: "Creator" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: "Viewer" })).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: "Role 1 Edit" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: "Role 2 Edit" })
    ).toBeInTheDocument();
  });

  it("should link to create role", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
    }));

    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );
    await userEvent.click(screen.getByRole("button", { name: "Add New Role" }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/roles/create");
    });
  });

  it("should link to role permissions for only non-system roles", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
    }));

    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );

    const tableRows = await screen.findAllByRole("link", { name: "Edit" });

    expect(tableRows).toHaveLength(2);
  });

  it("should delete role for only non-system roles", async () => {
    const pushMock = jest.fn();
    const replaceMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
      replace: replaceMock,
    }));

    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );

    const tableRows = await screen.findAllByRole("row");

    expect(tableRows).toHaveLength(5);

    expect(
      within(tableRows[1]).queryByRole("button", {
        name: "Delete Button",
      })
    ).not.toBeInTheDocument();

    expect(
      within(tableRows[2]).queryByRole("button", {
        name: "Delete Button",
      })
    ).not.toBeInTheDocument();

    await userEvent.click(
      within(tableRows[4]).getByRole("button", {
        name: "Delete Button",
      })
    );

    const confirmBox = await screen.findByRole("alertdialog", {
      name: "Confirm Delete",
    });

    await userEvent.click(
      await within(confirmBox).findByRole("button", { name: "Confirm" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Deleted Successfully"
    );

    expect(replaceMock).toHaveBeenCalledWith("/roles");
    expect(await screen.findAllByRole("row")).toHaveLength(4);
  });
});
