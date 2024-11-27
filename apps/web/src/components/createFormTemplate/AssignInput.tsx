import { LegacyRef, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb } from 'pdf-lib';

import { Button } from '@chakra-ui/react';
import { TextIcon, PlusSign } from 'apps/web/src/static/icons';
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
  const [currentGroup, setCurrentGroup] = useState<string>('');

  const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageDetails, setPageDetails] = useState<PageCallback | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [formType, setFormType] = useState<FormFieldType>(
    FormFieldType.TextField,
  );
  // generate random id and color for initial textbox/group
  useEffect(() => {
    const myuuid = uuidv4();
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let mapCpy = new Map();
    mapCpy.set(myuuid, { fields: new Map(), color: randomColor });
    setCurrentGroup(myuuid);
    setFormFieldGroups(mapCpy);
  }, []);

  return (
    <div>
      {Array.from(formFieldGroups.entries()).map(([key, value], index) => (
        <Button
          backgroundColor="white"
          border="1px solid #1367EA"
          key={index}
          onClick={() => {
            setCurrentGroup(key);
          }}
        >
          <span
            style={{
              fontFamily: 'Hanken Grotesk',
              fontSize: '16px',
              color: '#1367EA',
              fontWeight: 600,
              lineHeight: '22px',
              textAlign: 'left',
            }}
          >
            Group {index + 1}
          </span>
        </Button>
      ))}
      <Button
        backgroundColor="white"
        border="1px solid #1367EA"
        //Add New Group
        onClick={() => {
          const myuuid = uuidv4();
          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
            16,
          )}`;
          let mapCpy = new Map(formFieldGroups);
          mapCpy.set(myuuid, { fields: new Map(), color: randomColor });
          setFormFieldGroups(mapCpy);
          setCurrentGroup(myuuid);
        }}
      >
        {PlusSign}
        <span
          style={{
            fontFamily: 'Hanken Grotesk',
            fontSize: '16px',
            color: '#1367EA',
            fontWeight: 600,
            lineHeight: '22px',
            textAlign: 'left',
            marginLeft: '6px',
          }}
        >
          Add group
        </span>
      </Button>
      <div style={styles.container}>
        {pdf ? (
          <div style={{"maxHeight": "800px", "overflow": "scroll"}}>
            <div style={styles.controls}>
              <Button
                marginRight={8}
                backgroundColor="#1367EA"
                onClick={() => {
                  const fieldId = uuidv4();
                  let formFieldCopy = new Map(formFieldGroups);
                  formFieldCopy.get(currentGroup)?.fields.set(fieldId, {
                    x: 0,
                    y: 0,
                    width: 80,
                    height: 30,
                  });
                  setFormFieldGroups(formFieldCopy);
                  //Add Text Field
                }}
              >
                {TextIcon}
              </Button>

              <Button
                marginRight={8}
                title={'Reset'}
                onClick={() => {
                  setSignatureDialogVisible(false);
                  setSignatureURL(null);
                  // setPdf(null);
                  setTotalPages(0);
                  setPageNum(0);
                  setPageDetails(null);
                }}
              />
            </div>
            <div> 
            <div ref={documentRef} style={styles.documentBlock}>
              

              {/* {signatureURL ? (
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
              ) : null} */}
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
                >
                  {Array.from(formFieldGroups.entries()).map(
                ([groupId, groupValues], index) => (
                  <>
                    {Array.from(groupValues.fields.entries()).map(
                      ([fieldId, pos], index) => (
                        <DraggableText
                          key={index}
                          color={groupValues.color ?? '#000'}
                          initialText={null}
                          onStop={(e: DraggableEvent, data: DraggableData) => {
                            let formFieldCpy = new Map(formFieldGroups);

                            formFieldCpy.get(groupId)?.fields.set(fieldId, {
                              width: pos.width,
                              height: pos.height,
                              x: data.x,
                              y: data.y,
                            });
                            console.log(formFieldCpy.get(groupId)?.fields.get(fieldId));
                            setFormFieldGroups(formFieldCpy);
                          }}
                          onResizeStop={(
                            e: MouseEvent | TouchEvent,
                            dir: ResizeDirection,
                            elementRef: HTMLElement,
                            delta: ResizableDelta,
                            position: Position,
                          ) => {
                            let formFieldCpy = new Map(formFieldGroups);
                            let newWidth = parseFloat(elementRef.style.width);
                            let newHeight = parseFloat(elementRef.style.height);
                            formFieldCpy
                              .get(currentGroup)
                              ?.fields.set(fieldId, {
                                width: Number.isNaN(newWidth)
                                  ? pos.width
                                  : newWidth,
                                height: Number.isNaN(newHeight)
                                  ? pos.height
                                  : newHeight,
                                x: position.x,
                                y: position.y,
                              });
                              console.log(formFieldCpy.get(groupId)?.fields.get(fieldId));

                            setFormFieldGroups(formFieldCpy);
                            setPosition({
                              width: parseFloat(elementRef.style.width),
                              height: parseFloat(elementRef.style.height),
                              x: position.x,
                              y: position.y,
                            });
                          }}
                        />
                      ),
                    )}
                  </>
                ),
              )}
                  </Page>
              </Document>
            </div>
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
