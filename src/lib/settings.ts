export const ITEM_PER_PAGE = 5

type routeAccessMap = {
    [key: string]: string[]
}
export const routeAccessMap: routeAccessMap = {
    "/admin(.*)": ["admin"],
    "/teacher(.*)": ["teacher"],
    "/student(.*)": ["student"],
    "/parent(.*)": ["parent"],
    "/list/teachers": ["admin", "teacher"],
    "/list/students": ["admin", "teacher"],
    "/list/parents": ["admin", "teacher"],
    "/list/subjects": ["admin"],
    "/list/classes": ["admin", "teacher"],
    "/list/exams": ["admin", "teacher", "student", "parent"],
    "/list/assignments": ["admin", "teacher", "student", "parent"],
    "/list/results": ["admin", "teacher", "student", "parent"],
    "/list/events": ["admin", "teacher", "student", "parent"],
    "/list/announcements": ["admin", "teacher", "student", "parent"]
}