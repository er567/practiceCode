### 定义 

------

vertical-align 属性设置元素的垂直对齐方式。该属性定义行内元素的基线相对于该元素所在行的基线的垂直对齐。

在需要居中的元素前插入一个基线 

    parentsElement::before{
        content: " "; 
        height: 100%; 
        display: inline-block; 
        vertical-align: middle; 
    }