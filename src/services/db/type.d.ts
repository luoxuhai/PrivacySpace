type FileExtra = {
  /** 文件资源ID */
  source_id?: string;
  /** 文件资源Hash*/
  source_hash?: string;
  /** 是否为相册 */
  is_album?: boolean;
  /** 在相册中 */
  in_album?: boolean;
  /** 文件夹封面 */
  cover?: string | null;
  /** 视频时长 */
  duration?: number;
  width?: number;
  height?: number;
  [key: string]: any;
};

type UserExtra = {
  username?: string;
  [key: string]: any;
};
