import { Annotation } from '@atjson/document'
import Renderer, { Context } from '@atjson/renderer-hir'
//import { CommentState } from 'api'
import { schema } from 'prosemirror-schema-basic'

export default class ProsemirrorRenderer extends Renderer {
  *root(): any {
    let children = yield
    console.log('doc children', children)
    return schema.node('doc', undefined, children)
  }

  *renderAnnotation(
    annotation: Annotation<any>,
    context: Context
  ): Iterator<void, any, any> {
    let annotationChildren = (yield).map((c: any) => {
      if (typeof c === 'string') return schema.text(c)
      else return c
    })

    if (annotation.type === 'strong' || annotation.type === 'em') {
      return annotationChildren.map((c: any) => {
        return c.mark([...c.marks, schema.mark(annotation.type)])
      })
    } else if (annotation.type === 'comment') {
      /*i f (annotation.attributes['state'] === CommentState.CLOSED)
        return annotationChildren */
      return annotationChildren.map((c: any) => {
        return c.mark([
          ...c.marks,
          schema.mark('comment', {
            id: annotation.id,
            author: annotation.attributes.author,
            authorColor: annotation.attributes.authorColor,
            message: annotation.attributes.message,
          }),
        ])
      })
    } else {
      if (annotationChildren.length === 0) annotationChildren = []

      console.log(annotation, annotationChildren)

      return schema.node(
        annotation.type,
        annotation.attributes,
        annotationChildren
      )
    }
  }
}
