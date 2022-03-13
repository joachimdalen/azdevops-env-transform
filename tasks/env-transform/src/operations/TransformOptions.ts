export interface TransformOptions {
  /**
   * String content instead of file to read from
   */
  content?: string;

  /**
   * Path to .env file to read from defaults to .env
   */
  inputPath?: string;

  /**
   * Path to where the transformed .env file should be written
   */
  outputPath?: string;

  /**
   * Transform mode.
   *
   * Replace replaces the key/val based on the key while subsitute uses the
   * normal $(var) syntax and only replaces the values.
   */
  mode: 'replace' | 'substitute';

  /**
   * If comments should be preserved when writing the output
   */
  preserveComments?: boolean;

  // /**
  //  * Get variable value
  //  */

  getVariable?: (name: string) => string | undefined;

  /**
   * Alternative logger for errors
   */
  errorLogger?: (message: string) => void;

  /**
   * Alternative logger for informational messages
   */
  infoLogger?: (message: string) => void;
}
