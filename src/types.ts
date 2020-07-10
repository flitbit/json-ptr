export type PathSegment = string | number;
export type PathSegments = readonly PathSegment[];

export type JsonStringPointer = string;
export type UriFragmentIdentifierPointer = string;
export type Pointer = JsonStringPointer | UriFragmentIdentifierPointer;

/**
 * List item used when listing pointers and their values in an object graph.
 */
export interface JsonStringPointerListItem {
  /**
   * Contains the location of the value in the evaluated object graph.
   */
  readonly pointer: JsonStringPointer;
  /**
   * The value at the pointer's location in the object graph.
   */
  readonly value: unknown;
}

/**
 * List item used when listing fragment identifiers and their values in an object graph.
 */
export interface UriFragmentIdentifierPointerListItem {
  /**
   * Contains the location (as a fragmentId) of the value in the evaluated object graph.
   */
  readonly fragmentId: UriFragmentIdentifierPointer;
  /**
   * The value at the pointer's location in the object graph.
   */
  readonly value: unknown;
}

export type Decoder = (ptr: Pointer) => PathSegments;
export type Encoder = (ptr: PathSegments) => Pointer;
