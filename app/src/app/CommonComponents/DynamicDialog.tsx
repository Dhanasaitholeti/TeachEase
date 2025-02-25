"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "../component/ui/dialog";
import { Button } from "../component/ui/button";

interface DynamicDialogProps {
  title: string;
  description?: string;
  triggerText: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  className?:string;
  titleClassName?:string;
  desClassName?:string
}

const DynamicDialog: React.FC<DynamicDialogProps> = ({
  title,
  description,
  triggerText,
  isOpen,
  setIsOpen,
  children,
  className = "",
  titleClassName="",
  desClassName = ""
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      <Button
          onClick={() => setIsOpen(true)}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  ${className}`}
        >{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={`  ${titleClassName}`}>{title}</DialogTitle>
          {description && <DialogDescription className={`  ${desClassName}`}>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DynamicDialog;
