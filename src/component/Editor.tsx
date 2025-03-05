import React, { useEffect, useRef } from "react";
import { mathSerializer } from "@benrbray/prosemirror-math";
import { DOMParser } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { customSchema } from "./model/schema";
import { pluginSetUp } from "./plugin";
import katex from "katex";

const Editor = () => {
  const editorRef = useRef(null);
  const initialRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const state = EditorState.create({
      schema: customSchema,
      doc: DOMParser.fromSchema(customSchema).parse(
        initialRef.current as unknown as HTMLElement
      ),
      plugins: pluginSetUp({ schema: customSchema }),
    });

    const view = new EditorView(editorRef.current, {
      state,
      clipboardTextSerializer: (slice) => {
        return mathSerializer.serializeSlice(slice);
      },
      //dispatchTransaction: () => {},
    });

    // focus
    view.focus();

    // new MyEditorView(editorRef.current, "hi")
  }, []);

  const html = `
      <h3>Math</h3>
      <blockquote>$..$ 입력 또는 $$ 입력으로 수식을 입력할 수 있다</blockquote>
      <p></p>
      <math-display>A_0 = \\mathrm{Span}\\left\\{
      \\begin{aligned}[c]
      (v_1 + v_2) \\otimes w - (v_1 \\otimes w) - (v_2 \\otimes w) \\\\
      v \\otimes (w_1 + w_2) - (v \\otimes w_1) - (v \\otimes w_2) \\\\
      (\\alpha v) \\otimes w - \\alpha (v \\otimes w) \\\\
      v \\otimes (\\alpha w) - \\alpha (v \\otimes w)
      \\end{aligned}
      \\;\\middle\\vert\\;
      \\begin{array}{l}
      \\alpha \\in F \\\\ v \\in V, w \\in W
      \\end{array}
      \\right\\}</math-display>
      <ul>
          <li>$..$ : inline-math</li>
          <li>$$ : math-block</li>
      </ul>
      <p></p>
  `;

  function replaceMathWithRendered(html: string) {
    return html.replace(
      /<math-(display|inline)>([\s\S]*?)<\/math-\1>/g,
      (match, type, latex) => {
        try {
          return katex.renderToString(latex.trim(), {
            throwOnError: false,
            output: "html",
            strict: false,
            trust: true,
            displayMode: true,
          });
        } catch (error) {
          console.error("KaTeX rendering error:", error);
          return match;
        }
      }
    );
  }

  console.log(replaceMathWithRendered(html));

  return (
    <div className="content">
      <div className="center">
        <div id="editor" ref={editorRef} spellCheck="false"></div>
      </div>
      <div id="editor-content" ref={initialRef} style={{ display: "block" }}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: replaceMathWithRendered(html),
        }}
      />
    </div>
  );
};

export default Editor;
