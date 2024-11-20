import { LegacyRef, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb } from 'pdf-lib';

import { Button } from '@chakra-ui/react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import DraggableText from '../DraggableText';
import DraggableSignature from '../DraggableSignature';
import PagingControl from '../PagingControl';
import { PDFPageProxy } from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import { Position, ResizableDelta } from 'react-rnd';

type PageCallback = PDFPageProxy & {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
};
enum FormFieldType {
  Signature,
  TextField,
  Checkbox,
}
type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

type TextFieldPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

//approach: if text field, x = form.createCheckBox(name), x.addToPage(page, {coords, (and other styling values etc)})
// if we want to access the coords, query the widgets in the page/form (don't know exactly how to do this )
// widget = represents each field

export const AssignInput = () => {
  console.log(pdfjs.version);
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  const styles = {
    container: {
      maxWidth: 900,
      margin: '0 auto',
    },
    sigBlock: {
      display: 'inline-block',
      border: '1px solid #000',
    },
    documentBlock: {
      maxWidth: 800,
      margin: '20px auto',
      marginTop: 8,
      border: '1px solid #999',
    },
    controls: {
      maxWidth: 800,
      margin: '0 auto',
      marginTop: 8,
    },
  };

  const [pdf, setPdf] = useState('http://localhost:3002/test.pdf');
  const [signatureURL, setSignatureURL] = useState(null);
  const [position, setPosition] = useState<TextFieldPosition | null>(null);

  const [formFieldGroups, setFormFieldGroups] = useState<
    Map<string, { fields: Map<string, TextFieldPosition>; color: string }>
  >(new Map());
  const [currentGroup, setCurrentGroup] = useState<string>();

  const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageDetails, setPageDetails] = useState<PageCallback | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [formType, setFormType] = useState<FormFieldType>(
    FormFieldType.TextField,
  );
  const addGroup = () => {
    const myuuid = uuidv4();
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let mapCpy = new Map(formFieldGroups);
    mapCpy.set(myuuid, { fields: new Map(), color: randomColor });
    setFormFieldGroups(mapCpy);
  };

  useEffect(() => {
    const myuuid = uuidv4();
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let mapCpy = new Map();
    mapCpy.set(myuuid, { fields: new Map(), color: randomColor });
    setCurrentGroup(myuuid);
    setFormFieldGroups(mapCpy);
  }, []);

  // const setUrl = (formBlob: Blob) => {
  //   if (formBlob) {
  //     const url = URL.createObjectURL(formBlob);
  //     setPdf(url);
  //   }
  // };
  console.log(formFieldGroups)
  return (
    <div>
      {formFieldGroups.entries().map(([key, value], index) => (
        <Button
          key={index}
          onClick={() => {
            setCurrentGroup(key);
          }}
        >
          Group {index + 1}
        </Button>
      ))}
      <Button
        onClick={() => {
          const myuuid = uuidv4();
          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
            16,
          )}`;
          let mapCpy = new Map(formFieldGroups);
          mapCpy.set(myuuid, { fields: new Map(), color: randomColor });
          setFormFieldGroups(mapCpy);
          console.log(mapCpy)
        }}
      >
        Add New Group
      </Button>
      <div style={styles.container}>
        {pdf ? (
          <div>
            <div style={styles.controls}>
              
              {!signatureURL ? (
                <Button
                  marginRight={8}
                  title={'Add signature'}
                  onClick={() => setSignatureDialogVisible(true)}
                />
              ) : null}
              <Button
                marginRight={8}
                title={'Add Text'}
                onClick={() => setTextInputVisible(true)}
              />
              <Button
                marginRight={8}
                title={'Reset'}
                onClick={() => {
                  setTextInputVisible(false);
                  setSignatureDialogVisible(false);
                  setSignatureURL(null);
                  // setPdf(null);
                  setTotalPages(0);
                  setPageNum(0);
                  setPageDetails(null);
                }}
              />
              {/* {pdf ? (
                <Button
                  marginRight={8}
                  title={'Download'}
                  onClick={() => {
                    downloadURI(pdf, 'file.pdf');
                  }}
                />
              ) : null} */}
            </div>
            <div ref={documentRef} style={styles.documentBlock}>
              {textInputVisible ? (
                <DraggableText
                  color={formFieldGroups.get(currentGroup!)?.color ?? '#000'}
                  initialText={null}
                  onCancel={() => setTextInputVisible(false)}
                  onStop={(e: DraggableEvent, data: DraggableData) =>
                    setPosition({
                      width: data.deltaX,
                      height: data.deltaY,
                      x: data.x,
                      y: data.y,
                    })
                  }
                  onResizeStop={(
                    e: MouseEvent | TouchEvent,
                    dir: ResizeDirection,
                    elementRef: HTMLElement,
                    delta: ResizableDelta,
                    position: Position,
                  ) => {
                    console.log(position.x, position.y);
                    setPosition({
                      width: parseFloat(elementRef.style.width),
                      height: parseFloat(elementRef.style.height),
                      x: position.x,
                      y: position.y,
                    });
                  }}
                  // onSet={async () => {
                  //   if (
                  //     pageDetails &&
                  //     documentRef &&
                  //     documentRef.current &&
                  //     position
                  //   ) {
                  //     const { originalHeight, originalWidth } = pageDetails;
                  //     const scale =
                  //       originalWidth / documentRef.current.clientWidth;
                  //     console.log(scale);

                  //     const existingPdfBytes = await fetch(pdf).then((res) =>
                  //       res.arrayBuffer(),
                  //     );
                  //     var bytes = new Uint8Array(existingPdfBytes);
                  //     const pdfDoc = await PDFDocument.load(bytes);

                  //     const pages = pdfDoc.getPages();
                  //     const form = pdfDoc.getForm();

                  //     const firstPage = pages[pageNum];
                  //     const size = 20;
                  //     const myUUID = uuidv4();
                  //     const newField = form.createTextField(myUUID);
                  //     newField.addToPage(firstPage, {
                  //       x: scale * position.x,
                  //       y: originalHeight - scale * position.y - size,
                  //       height: 20
                  //       });
                  //     const pdfBytes = await pdfDoc.save();

                  //     const blob = new Blob([new Uint8Array(pdfBytes)]);
                  //     setUrl(blob);
                  //     setPosition(null);
                  //     setTextInputVisible(false);
                  //   }
                  // }}
                />
              ) : null}
              {signatureURL ? (
                <DraggableSignature
                  url={signatureURL}
                  onCancel={() => {
                    setSignatureURL(null);
                  }}
                  onSet={async () => {
                    if (
                      pageDetails &&
                      documentRef &&
                      documentRef.current &&
                      position
                    ) {
                      const { originalHeight, originalWidth } = pageDetails;
                      const scale =
                        originalWidth / documentRef.current.clientWidth;

                      const y =
                        documentRef.current.clientHeight -
                        (position.y -
                          position.height +
                          64 -
                          documentRef.current.offsetTop);
                      const x =
                        position.x -
                        160 -
                        position.width -
                        documentRef.current.offsetLeft;

                      // new XY in relation to actual document size
                      const newY =
                        (y * originalHeight) / documentRef.current.clientHeight;
                      const newX =
                        (x * originalWidth) / documentRef.current.clientWidth;

                      const pdfDoc = await PDFDocument.load(pdf);

                      const pages = pdfDoc.getPages();
                      const firstPage = pages[pageNum];

                      const pngImage = await pdfDoc.embedPng(signatureURL);
                      const pngDims = pngImage.scale(scale * 0.3);

                      firstPage.drawImage(pngImage, {
                        x: newX,
                        y: newY,
                        width: pngDims.width,
                        height: pngDims.height,
                      });

                      const pdfBytes = await pdfDoc.save();
                      const blob = new Blob([new Uint8Array(pdfBytes)]);

                      // const URL = await blobToURL(blob);
                      // setPdf(URL);
                      setPosition(null);
                      setSignatureURL(null);
                    }
                  }}
                  onEnd={(e: DraggableEvent, data: DraggableData) =>
                    setPosition({
                      width: data.deltaX,
                      height: data.deltaY,
                      x: data.x,
                      y: data.y,
                    })
                  }
                />
              ) : null}
              <Document
                file={'http://localhost:3002/test.pdf'}
                onLoadSuccess={(data) => {
                  setTotalPages(data.numPages);
                }}
              >
                <Page
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  pageNumber={pageNum + 1}
                  onLoadSuccess={(page: PageCallback) => {
                    setPageDetails(page);
                  }}
                />
              </Document>
            </div>
            <PagingControl
              pageNum={pageNum}
              setPageNum={setPageNum}
              totalPages={totalPages}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
