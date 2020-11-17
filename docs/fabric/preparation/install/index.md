# Установка программ
Minecraft написан на языке Java, поэтому для запуска игры её можно загрузить с [официального сайта](https://java.com/ru/download/). 

Для разработки модов нам может потребоваться IDE, например [IntelliJ IDEA](https://www.jetbrains.com/ru-ru/idea/download/#section=windows) или [Eclipse](https://www.eclipse.org/downloads/).

## JDK 
В стандартном Java пакете нет средств для написания кода, поэтому нам нужно загрузить JDK (Java Development Kit). Скачайте и установите его с [официального сайта](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), следуя инструкциям по установке.

## Fabric

### Ручная установка
Нам нужно загрузить [fabric-example-mod](https://github.com/FabricMC/fabric-example-mod/) (или [fabric-example-mod-kotlin](https://github.com/natanfudge/fabric-example-mod-kotlin) для Kotlin) с GitHub.

Распакуем архив в любое место. Вы можете удалить файлы `README.md` и `LICENSE`, поскольку они не являются обязательными. 

Откроем `gradle.properties` и заменим его вот этими строками:
```properties
# Done to increase the memory available to gradle.
org.gradle.jvmargs=-Xmx1G

# Fabric Properties
	# check these on https://fabricmc.net/use
	minecraft_version=1.16.3
	yarn_mappings=1.16.3+build.47
	loader_version=0.10.8

# Mod Properties
	mod_version = 1.0.0
	maven_group = ru.mcmodding     # Наш домен и никнейм
	archives_base_name = fabrictut # Это будет ID нашего мода

# Dependencies
	# currently not on the main fabric site, check on the maven: https://maven.fabricmc.net/net/fabricmc/fabric-api/fabric-api
	fabric_version=0.26.0+1.16

```

В `maven_group` укажите Ваш домен и никнейм, а в `archives_base_name` укажите ID Вашего мода.

Теперь откройте `build.gradle` и найдите блок кода, начинающийся с "dependencies". Замените его этим:
```groovy
dependencies {
    minecraft "com.mojang:minecraft:1.16.3"
    mappings "net.fabricmc:yarn:1.16.3+build.47:v2"
    modImplementation "net.fabricmc:fabric-loader:0.10.8"
            
    //Fabric api
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.26.0+1.16"
}
```

Сохраните и импортируйте `build.gradle` в Вашу IDE. Этот шаг может отличаться в зависимости от IDE.

Для генерации исходников используйте `gradlew genSources` или `./gradlew genSources` на MacOS и Linux.

### IntelliJ IDEA
1. Откройте либо импортируйте проект
2. Выберите `build.gradle` из того места, где Вы распаковали архив, загруженный раннее
3. После того, как Gradle настроится, закройте и заново откройте проект, чтобы исправить конфигурации запуска 
4. Если конфигурации запуска всё еще не отображаются, попробуйте импортирировать проект заново из вкладки Gradle в IDEA

**Не запускайте `./gradlew idea`, поскольку это испортит настроенное окружение!**

### Eclipse
Запустите команду `gradlew eclipse` для генерации конфигураций запуска и импортируйте проект.

### MinecraftDev IntelliJ IDEA плагин
Вы можете облегчить установку и настройку проекта с помощью плагина [MinecraftDev IntelliJ IDEA](https://plugins.jetbrains.com/plugin/8327). 
Вы можете создать новый проект Fabric, заполнить нужные поля вроде названия проекта и версии игры, плагин сам запустит нужные задачи в Gradle и настроит окружение.

## Примечания
* Хотя Fabric API не является строго необходимым для разработки, он рекомендуется для использования, так как может неявно использоваться в некоторых руководствах.
*   Иногда при разработке Fabric-loom (плагин сборки Gradle) могут возникать проблемы, требующие сброса файлов кеша. Это можно сделать, запустив `gradlew cleanloom`.
Запуск `gradlew --stop` также может помочь с некоторыми редкими проблемами.
* Иногда ассеты могут загрузиться неккоректно, в таком случае в игре могут отсутствовать звуки. Запустите `gradlew downloadAssets` чтобы загрузить ассеты заново. 
