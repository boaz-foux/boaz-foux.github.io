---
layout: post
title:  "Adding style"
date:   2024-03-13T12:23:09.000Z
update: 2024-03-13T12:23:09.000Z
categories: general stuff style
group: style
---
# The Main Plan
At first about using tailwind as the basic css, but unfortunately without a basic build system it will be hard to manage all the naming and architecture.
So I have started with something simple.
By building the style from scratch, it give me also the freedom to build stuff like the glitch effect.

[ ] Building component system for the blog
[ ] Adding tailwind

## syntax highlighter

```scss
.highlight {
    .highlighter-rouge & {}
    /* Name.Builtin.Pseudo */
    .bp,
    /* Comment */
    .c,
    /* Comment.Single */
    .c1,
    /* Comment.Multiline */
    .cm,
    /* Comment.Preproc */
    .cp,
    /* Comment.Special */
    .cs,
    /* Error */
    .err,
    /* Generic.Deleted.Specific */
    .gd .x,
    /* Generic.Deleted */
    .gd,
    /* Generic.mph */
    .ge,
    /* Generic.Heading */
    .gh,
    /* Generic.Inserted */
    .gi,
    /* Generic.Inserted.Specific */
    .gi .x,
    /* Generic.Output */
    .go,
    /* Generic.Prompt */
    .gp,
    /* Generic.Error */
    .gr,
    /* Generic.Strong */
    .gs,
    /* Generic.Traceback */
    .gt,
    /* Generic.Subheading */
    .gu,
    /* Literal.Number.Integer.Long */
    .il,
    /* Keyword */
    .k,
    /* Keyword.Constat */
    .kc,
    /* Keyword.Declration */
    .kd,
    /* Keyword.Pseudo */
    .kp,
    /* Keyword.Reserved */
    .kr,
    /* Keyword.Type */
    .kt,
    /* Keyword.Type */
    .kt,
    /* Literal.Number */
    .m,
    /* Literal.Number.Float */
    .mf,
    /* Literal.Number.Hex */
    .mh,
    /* Literal.Number.Integer */
    .mi,
    /* Literal.Number.Oct */
    .mo,
    /* Name.Attribute */
    .na,
    /* Name.Builtin */
    .nb,
    /* Name.Class */
    .nc,
    /* Name.Exception */
    .ne,
    /* Name.Function */
    .nf,
    /* Name.Entity */
    .ni,
    /* Name.Namespace */
    .nn,
    /* Name.Constant */
    .no,
    /* Name.Tag */
    .nt,
    /* Name.Variable */
    .nv,
    /* Name.Function */
    .nx,
    /* Operator */
    .o,
    /* Operator.Word */
    .ow,
    /* Literal.String */
    .s,
    /* Literal.String.Single */
    .s1,
    /* Literal.String.Double */
    .s2,
    /* Literal.String.Backtick */
    .sb,
    /* Literal.String.Char */
    .sc,
    /* Literal.String.Doc */
    .sd,
    /* Literal.String.Escape */
    .se,
    /* Literal.String.Heredoc */
    .sh,
    /* Literal.String.Interpol */
    .si,
    /* Literal.String.Regex */
    .sr,
    /* Literal.String.Symbol */
    .ss,
    /* Literal.String.Other */
    .sx,
    /* Name.Variable.Class */
    .vc,
    /* Name.Variable.Global */
    .vg,
    /* Name.Variable.Instance */
    .vi,
    /* Text.Whitespace */
    .w {}
}
```