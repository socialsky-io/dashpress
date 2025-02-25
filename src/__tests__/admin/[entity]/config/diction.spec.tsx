import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import EntityDictionSettings from "pages/admin/[entity]/config/diction";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/config/diction", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
    }));
  });

  it("should display diction values", async () => {
    render(
      <ApplicationRoot>
        <EntityDictionSettings />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Plural")).toHaveValue("Plural entity-1");
    });
    expect(screen.getByLabelText("Singular")).toHaveValue("Singular entity-1");
  });

  it("should update diction successfully", async () => {
    render(
      <ApplicationRoot>
        <EntityDictionSettings />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Plural"), "Updated");
    await userEvent.type(screen.getByLabelText("Singular"), "Updated");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Diction Settings" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Diction Settings Saved Successfully"
    );
  });

  it("should display updated diction values", async () => {
    render(
      <ApplicationRoot>
        <EntityDictionSettings />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Plural")).toHaveValue(
        "Plural entity-1Updated"
      );
    });
    expect(screen.getByLabelText("Singular")).toHaveValue(
      "Singular entity-1Updated"
    );
  });
});
