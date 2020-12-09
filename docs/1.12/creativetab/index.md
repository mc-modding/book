description: Создание вкладки в креативе.

# Создание вкладки в креативе.

Перейдём в главный класс и добавим переменную:
```java
public static final CreativeTabs CTAB = new CreativeTabs("tut") {
    @Override
    public ItemStack getTabIconItem() {
        return new ItemStack(ItemsRegister.KEY);
    }
};
```

* `tut` - это ключ локализации. (см. статью "Локализация")
* `getTabIconItem` - этот метод возвращает как иконку предмет ключа.

[![Вкладка 1](images/tab_1.png)](images/tab_1.png)

Теперь нам нужно добавить туда предметы/блоки. Чтобы это сделать перейдём в класс с предметом, к примеру в `ItemKey` и пропишем в конструктор такой метод:
```java
this.setCreativeTab(Tutorial.CTAB);
```

* `Tutorial` - это наш главный класс.
* `CTAB` - это наша переменная.

Заходим в игру и видим, что наш предмет добавился во вкладку. (С блоками так же)

[![Вкладка 2](images/tab_2.png)](images/tab_2.png)