"use client";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { APP_LIST, useCurrentApp } from "@/providers/SwitchAppProvider";
import { Button } from "./ui/button";
import { listApp } from "@/constants";

const SwitchAppDropdown = () => {
  const {
    currentApp,
    action: { changeApp },
  } = useCurrentApp();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="bg-white">
          Switch App: {currentApp}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white min-w-[200px]">
        {listApp.map((app) => (
          <DropdownMenuItem
            key={app}
            onClick={() => changeApp(app as APP_LIST)}
          >
            {app.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SwitchAppDropdown;
