import React, { useState, useCallback, useRef } from "react";
 import { DragAndDropInputProps } from "../../types/types";
 import styles from "./DragAndDropInput.module.scss";

 interface Props extends DragAndDropInputProps {
  onClick?: () => void;
 }

 const DragAndDropInput: React.FC<Props> = ({
  onFilesChange,
  isDragging,
  setIsDragging,
  onClick,
 }) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(true);
  }, [setIsDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);
  }, [setIsDragging]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  }, []);

  const handleDrop = useCallback(
  (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);

  const droppedFiles = Array.from(e.dataTransfer.files);
  onFilesChange(droppedFiles);
  },
  [onFilesChange, setIsDragging]
  );

  React.useEffect(() => {
  const div = dropRef.current;
  if (div) {
  div.addEventListener("dragenter", handleDragEnter as any);
  div.addEventListener("dragover", handleDragOver as any);
  div.addEventListener("dragleave", handleDragLeave as any);
  div.addEventListener("drop", handleDrop as any);

  return () => {
  div.removeEventListener("dragenter", handleDragEnter as any);
  div.removeEventListener("dragover", handleDragOver as any);
  div.removeEventListener("dragleave", handleDragLeave as any);
  div.removeEventListener("drop", handleDrop as any);
  };
  }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
  <div
  ref={dropRef}
  className={`${styles.DragAndDropInput} ${
  isDragging ? styles["DragAndDropInput--dragging"] : ""
  }`}
  onClick={onClick}
  >
  <p>Drag and drop files here</p>
  </div>
  );
 };

 export default DragAndDropInput;